import e from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "../validator/product.validator.js";
import {
  addSingleProductImage,
  createProduct,
  deleteProduct,
  deleteSingleProductImage,
  getAll_MyProducts_withPagination,
  myProduct,
  updateProduct,
  updateSingleProductImage,
} from "../controllers/product.controller.js";
import paginationSchema from "../validator/paginationSchema.js";

const router = e.Router();

router.post(
  "/create-product",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.array("images", 5),
  validate(createProductSchema, "body"),
  createProduct,
);

router.patch(
  "/update-product/:productId",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.array("images", 5),
  validate(updateProductSchema, "body"),
  updateProduct,
);

// image upload

router.patch(
  "/update-singleProductImage/:productId",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.single("image"),
  updateSingleProductImage,
);

router.delete(
  "/delete-singleProductImage/:productId",
  verifyToken,
  authorizedRoole("seller"),
  deleteSingleProductImage,
);

router.put(
  "/add-singleProductImage/:productId",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.single("image"),
  addSingleProductImage,
);

router.delete(
  "/delete-product/:productid",
  verifyToken,
  authorizedRoole("seller"),
  deleteProduct,
);
router.get(
  "/my-product/:productId",
  verifyToken,
  authorizedRoole("seller"),
  validate(productIdSchema, "params"),
  myProduct,
);

router.get(
  "/get-allProducts_withPagination",
  verifyToken,
  authorizedRoole("seller"),
  validate(paginationSchema, "query"),
  getAll_MyProducts_withPagination,
);

export default router;
