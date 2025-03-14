import { Router } from "express";
import { restrictTo } from "../controllers/auth-controller";
import { protect } from "../middleware/protect";
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from "../controllers/tour-controller";

const router = Router();

//Tour
router
  .route("/")
  .post(protect, restrictTo("guide"), createTour)
  .get(protect, restrictTo("guide", "admin"), getAllTours);

router
  .route("/:id")
  .get(protect, getTour)
  .patch(protect, restrictTo("guide", "admin"), updateTour)
  .delete(protect, restrictTo("guide", "admin"), deleteTour);

export default router;
