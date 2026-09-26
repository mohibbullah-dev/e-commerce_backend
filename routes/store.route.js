import exress from "express";
import {
  storeCreate,
  storeStatusChange,
  deleteStore,
} from "../controllers/store.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";

const router = exress.Router();

router.post(
  "/create_store",
  verifyToken,
  authorizedRoole("seller"),
  uploadImage.single("logo"),
  storeCreate,
);

router.patch(
  "/store_status/:storeId",
  verifyToken,
  authorizedRoole("admin"),
  storeStatusChange,
);
router.delete(
  "/delete_store/:storeId",
  verifyToken,
  authorizedRoole("seller"),
  deleteStore,
);

export default router;
