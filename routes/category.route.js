import e from "express";
import { addCategory } from "../controllers/category.controller.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
const router = e.Router();

router.post(
  "/add-category",
  verifyToken,
  authorizedRoole("admin"),
  uploadImage.single("cat_image"),
  addCategory,
);

export default router;
