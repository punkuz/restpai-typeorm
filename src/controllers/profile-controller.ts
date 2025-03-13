import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../extra/async-handler";
import { profileRepo, userRepo } from "../repositories/repository";
import { User } from "../entities/user-entity";
import { Profile } from "../entities/profile-entity";

export interface AuthRequest extends Request {
  user?: User;
}

export const createProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Create a profile
    const profile = profileRepo().create(req.body);

    (profile as unknown as Profile).user = await userRepo().findOne({
      where: { id: req.user.id },
    });
    const savedProfile = await profileRepo().save(profile);
    res.status(201).json({
      status: "success",
      data: {
        profile: savedProfile,
      },
    });
  }
);

/**
 * @description Retrieves the profile of the logged-in user, optionally loading related entities based on query parameters.
 * @route GET /profile
 * @access Private (requires authentication)
 *
 * @param {AuthRequest} req - Express request object with authenticated user information.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @query {string} user - (Optional) The name of a related entity to load with the profile.
 * If provided, it will be added to the 'relations' array for eager loading.
 * Example: /profile?user=posts
 *
 * @returns {Promise<void>} - Sends a JSON response containing the user's profile and optionally loaded relations.
 * - 200 (OK): Profile successfully retrieved.
 * - 500 (Internal Server Error): If an error occurs during the process.
 * - 401 (Unauthorized): If the user is not authenticated.
 *
 * @throws {Error} - Passes any errors to the error handling middleware.
 *
 * @example
 * // To retrieve the profile with no relations:
 * // GET /profile
 *
 * // To retrieve the profile with the 'posts' relation loaded:
 * // GET /profile?user=posts
 */
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.query.user; // Correctly access the 'user' query parameter
    let relations: string[] = [];
    if (user && typeof user === "string") {
      relations.push(user);
    }
    const profile = await profileRepo().findOne({
      where: { user: { id: req.user.id } },
      relations,
    });
    res.status(200).json({
      status: "success",
      data: profile,
    });
  }
);

export const deleteProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Find the profile associated with the logged-in user's ID
      const profile = await profileRepo().findOne({
        where: { user: { id: req.user.id } },
      });

      if (!profile) {
        res.status(404).json({
          status: "fail",
          message: "Profile not found",
        });
        return; // Exit the function if the profile doesn't exist
      }

      // Delete the profile
      await profileRepo().remove(profile);

      res.status(204).send(); // 204 No Content (successful deletion)
    } catch (error) {
      next(error); // Pass errors to the error handling middleware
    }
  }
);
