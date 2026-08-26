import { Router } from "express";
import { adminLogin, get_user } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/admin_login", adminLogin);
router.get("/get_user", verifyToken, get_user);
export default router;
