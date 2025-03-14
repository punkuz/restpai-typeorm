import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../extra/async-handler";
import { profileRepo, tourRepo, userRepo } from "../repositories/repository";
import { User } from "../entities/user-entity";
import { Profile } from "../entities/profile-entity";
import { AuthRequest } from "./profile-controller";
import { Tour } from "../entities/tour-entity";
import NodeError, { validateColumns } from "../extra/node-error";
import { StatusCodes } from "../constants/status-codes";
import SearchFilter from "../extra/search-filter";

export const createTour = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Create a profile
    const tour = tourRepo().create(req.body);

    //Validate before saving
    const errorMessages = await validateColumns(tour);
    if (errorMessages && errorMessages.length > 0) {
      return next(new NodeError(errorMessages.join(", "), StatusCodes.BAD_REQUEST));
    }

    (tour as unknown as Tour).user = await userRepo().findOne({
      where: { id: req.user.id },
    });

    const savedTour = await tourRepo().save(tour);
    res.status(201).json({
      status: "success",
      data: {
        profile: savedTour,
      },
    });
  }
);

export const getTour = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    const { q } = req.query;
    let relations: string[] = [];
    if (q && typeof q === "string") {
      relations.push(q); // Add profile to relations if it exists and is a string.
    }
    //Make relation dynamic
    const tour = await tourRepo().findOne({
      where: { id: req.params.id },
      relations,
    });

    if (!tour) {
      throw new NodeError("Tour not found", StatusCodes.NOT_FOUND);
    }
    res.status(200).json({
      status: "success",
      data: tour,
    });
  }
);

export const getAllTours = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    //execute query
    let queryBuilder = tourRepo().createQueryBuilder("tour");

    const searchQuery = new SearchFilter<Tour>(queryBuilder, req.query)
      .filter()
      .sort()
      .fields()
      .paginate()
      .getQuery();

    const tours = await searchQuery.getMany();

    //send response
    res.status(StatusCodes.OK).json({
      state: "successful",
      data: {
        total: tours.length,
        tours,
      },
    });
  }
);

export const updateTour = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1) Get tour from table
    const tour = await tourRepo().findOne({
      where: { id: req.params.id },
    });
    if (!tour) {
      throw new NodeError("Tour not found", StatusCodes.NOT_FOUND);
    }
    const updatedTour = await tourRepo().save({
      ...tour,
      ...req.body, // Merge new fields from req.body
    });
    res.status(StatusCodes.OK).json({
      state: "successful",
      data: {
        updatedTour,
      },
    });
  }
);

export const deleteTour = asyncHandler(async (req: Request, res: Response) => {
  const tour = await tourRepo().findOne({ where: { id: req.params.id } });

  if (!tour) {
    throw new NodeError("Tour not found", StatusCodes.NOT_FOUND);
  }

  await tourRepo().remove(tour);

  res.status(200).json({
    status: "success",
    message: "Tour deleted successfully",
  });
});
