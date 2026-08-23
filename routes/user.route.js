import { Router } from "express";
import { adminLogin } from "../controllers/user.controller.js";

const router = Router();

router.post("/admin_login", adminLogin);
export default router;
