import { NextFunction, Response } from "express";
import { AuthRequest } from "../controllers/profile-controller";
import { validate } from "class-validator";
import { StatusCodes } from "../constants/status-codes";
import { User } from "../entities/user-entity";

export default class NodeError extends Error {
  code: number;
  isAppError: boolean;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.isAppError = true;
  }
}

//Validate before saving
export const validateColumns = async <T>(newUser: T[]): Promise<string[] | null> => {
  const errors = await validate(newUser);
  if (errors.length > 0) {
    const errorMessages = errors.map((error) => Object.values(error.constraints)).flat();
    return errorMessages;
  }
  return null;
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new NodeError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.sqlMessage.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new NodeError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new NodeError(message, 400);
};

const handleJWTError = () => new NodeError("Invalid session. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new NodeError("Your session has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  // console.log('errfrom', err);

  res.status(err.code || 500).json({
    error: err,
    message: err.message,
    // stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  // console.log("err", err);

  if (err.isAppError) {
    res.status(err.code).json({
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    //console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      state: "Fail",
      message: "Something went very wrong!",
    });
  }
};

export const ErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === "ER_DUP_ENTRY") error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
