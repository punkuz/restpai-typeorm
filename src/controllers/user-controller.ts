import { Response, NextFunction } from "express";
import { StatusCodes } from "../constants/status-codes";
import NodeError from "../extra/node-error";
import { userRepo } from "../repositories/repository";
import { asyncHandler } from "../extra/async-handler";
import { AuthRequest } from "./profile-controller";

export const getUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    const { q } = req.query;
    let relations: string[] = [];
    if (q && typeof q === "string") {
      relations.push(q); // Add profile to relations if it exists and is a string.
    }
    //Make relation dynamic
    const user = await userRepo().findOne({
      where: { id: req.user.id },
      relations,
    });

    if (!user) {
      throw new NodeError("User not found", StatusCodes.NOT_FOUND);
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);

export const getAllUsers = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    const { q } = req.query;
    let relations: string[] = [];
    if (q && typeof q === "string") {
      relations.push(q); // Add profile to relations if it exists and is a string.
    }
    const user = await userRepo().find({
      relations,
    });

    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);
