import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "../constants/status-codes";
import { User } from "../entities/user-entity";
import { userRepo } from "../repositories/repository";
import { validate } from "class-validator";
import NodeError from "../extra/node-error";
import { asyncHandler } from "../extra/async-handler";
import { userData } from "../constants/user-data";

//Generate a token using JWT
//@return token
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
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

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const newUser = userRepo().create(req.body);
    // Validate before saving
    // await validate(newUser);

    // Save user to the database
    const savedUser = await userRepo().save(newUser);
    createSendToken(savedUser as unknown as User, StatusCodes.CREATED, res);
  }
);

/* 
    @desc Post Login
    @route POST /api/v1/users/login
    @access private
**/
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new NodeError("Please provide email and password!", StatusCodes.BAD_REQUEST)
    );
  }
  // 2) Check if user exists && password is correct
  let user = await userRepo().findOne({
    where: { email },
    select: userData as any,
  });

  if (!user || !(await user.correctPassword(password))) {
    return next(new NodeError("Incorrect email or password", 401));
  }

  //update last login
  await userRepo().update(user.id, { lastLogin: new Date() });

  // // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

/* 
    @desc Update user password
    @route /api/v1/user/updatemypassword
    @access private
**/
export const updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const user = await userRepo().findOne({
    where: { id: req.user.id },
    select: userData as any,
  });
  console.log("in", user);

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword))) {
    return next(new NodeError("Your current password is wrong.", StatusCodes.INVALID));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await userRepo().save(user);

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

/*  @desc check for role authorization
    @route *.*
    @access private
**/
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['player'].role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new NodeError(
          "You do not have permission to perform this action",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    next();
  };
};
