import { Router } from "express";
import { signup, login, updatePassword, restrictTo } from "../controllers/auth-controller";
import { protect } from "../middleware/protect";
import {
  createProfile,
  deleteProfile,
  getProfile,
} from "../controllers/profile-controller";
import { getAllUsers, getUser } from "../controllers/user-controller";

const router = Router();

//User
router.route("/").get(protect, getUser);
router.route("/listusers").get(protect, restrictTo("admin"), getAllUsers)

//Auth
router.post("/signup", signup);
router.post("/login", login);
router.patch("/updatepassword", protect, updatePassword);

//Profile
router
  .route("/profile")
  .post(protect, createProfile)
  .get(protect, getProfile)
  .delete(protect, deleteProfile);

export default router;
