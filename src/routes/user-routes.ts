import { Router } from "express";
import { signup, login, updatePassword } from "../controllers/auth-controller";
import { protect } from "../middleware/protect";

const router = Router();

//Auth
router.post("/signup", signup);
router.post("/login", login);
router.patch("/updatepassword", protect, updatePassword);

export default router;
