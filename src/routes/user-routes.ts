import { Router } from "express"
import { signup } from "../controllers/auth-controller"

const router = Router()

//Auth
router.post("/signup", signup)

export default router