import e from "express";
import {
  addCategory,
  deleteCategory,
  getCategories_withPagination,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  addCategorySchema,
  UpdateCategorySchema,
} from "../validator/category.validator.js";
import paginationSchema from "../validator/paginationSchema.js";

const router = e.Router();

router.post(
  "/add-category",
  verifyToken,
  authorizedRoole("admin"),
  uploadImage.single("cat_image"),
  validate(addCategorySchema, "body"),
  addCategory,
);

router.patch(
  "/update-category/:categoryId",
  verifyToken,
  authorizedRoole("admin"),
  uploadImage.single("cat_image"),
  validate(UpdateCategorySchema),
  updateCategory,
);
router.get(
  "/get-categories_withPagination",
  validate(paginationSchema, "query"),
  getCategories_withPagination,
);

router.get("/get-categories", getCategories);

router.delete(
  "/delete-category/:categor_id",
  verifyToken,
  authorizedRoole("admin"),
  deleteCategory,
);

export default router;
