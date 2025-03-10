import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "../constants/status-codes";
import { User } from "../entities/user-entity";
import { userRepo } from "../repositories/repository";
import { validate } from "class-validator";

//Generate a token using JWT
//@return token
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : "7d",
  });
};

//Return token response
const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      user,
    },
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<any>  => {
  try {
    const newUser = userRepo().create(req.body)
    // Validate before saving
    const errors = await validate(newUser);
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        errors,
      });
    }

    // Save user to the database
    const savedUser = await userRepo().save(newUser);
    createSendToken(savedUser as unknown as User, StatusCodes.CREATED, res);
  } catch (error) {
    res.status(500).json({
      state:"fail",
      error
    })
  }
};
