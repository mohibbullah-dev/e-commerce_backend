import e from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validator/product.validator.js";
import {
  addSingleProductImage,
  createProduct,
  deleteProduct,
  deleteSingleProductImage,
  updateProduct,
  updateSingleProductImage,
} from "../controllers/product.controller.js";

const router = e.Router();

router.post(
  "/create-product/:shop_id",
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

export default router;
