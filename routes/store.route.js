import exress from "express";
import {
  storeCreate,
  storeStatusChange,
  deleteStore,
  myStore,
  updateStore,
} from "../controllers/store.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  storeCreateSchema,
  storeUpdateSchema,
} from "../validator/store.validator.js";

const router = exress.Router();

router.post(
  "/create_store",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validate(storeCreateSchema, "body"),
  storeCreate,
);

router.patch(
  "/store_status/:storeId",
  verifyToken,
  authorizedRoole("admin"),
  storeStatusChange,
);

router.patch(
  "/store-update/:productId",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validate(storeUpdateSchema, "body"),
  updateStore,
);
router.delete(
  "/delete_store/:storeId",
  verifyToken,
  authorizedRoole("seller"),
  deleteStore,
);

router.get("/my-store", verifyToken, authorizedRoole("seller"), myStore);

export default router;
