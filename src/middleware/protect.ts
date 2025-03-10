import { StatusCodes } from "../constants/status-codes";
import { asyncHandler } from "../extra/async-handler";
import NodeError from "../extra/node-error";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userRepo } from "../repositories/repository";
import { userData } from "../constants/user-data";

/* 
    @desc Protect middlware route
    @route *.*
    @access private
**/
export const protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (req.headers?.authorization ?? req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers?.authorization?.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies?.jwt;
  }
  
  if (!token) {
    return next(
      new NodeError(
        "You are not logged in! Please log in to get access.",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

  // 3) Check if user still exists
  const currentUser = await userRepo().findOne({
    where: {
      id: decoded?.id,
      isPermanentDeleted: false,
      isDeleted: false,
      isActive: true,
    },
    select: userData as any,
  });
  
  if (!currentUser || !currentUser.isActive) {
    return next(
      new NodeError(
        "This user account is deactivated or doesnot exist.",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new NodeError(
        "User recently changed password! Please log in again.",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
