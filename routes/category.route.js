import e from "express";
import {
  addCategory,
  getCategories,
} from "../controllers/category.controller.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  addCategorySchema,
  getCategorySchema,
} from "../validator/category.validator.js";
const router = e.Router();

router.post(
  "/add-category",
  verifyToken,
  authorizedRoole("admin"),
  uploadImage.single("cat_image"),
  validate(addCategorySchema, "body"),
  addCategory,
);
router.get(
  "/get-categories",
  verifyToken,
  authorizedRoole("admin"),
  validate(getCategorySchema, "query"),
  getCategories,
);

export default router;
