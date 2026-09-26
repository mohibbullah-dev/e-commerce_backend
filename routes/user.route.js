import { Router } from "express";
import {
  adminLogin,
  get_user,
  sellerLogin,
  sellerRegister,
  sellerStatusChanged,
  sellerReject,
  userRegister,
  userLogin,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizedRoole from "../middlewares/role.middleware.js";
import { uploadImage } from "../middlewares/multer.Middleware.js";

const router = Router();

// admin
router.post("/admin_login", adminLogin);
router.patch(
  "/seller_status_change/:sellerId",
  verifyToken,
  authorizedRoole("admin"),
  sellerStatusChanged,
);
router.patch(
  "/seller_reject/:sellerId",
  verifyToken,
  authorizedRoole("admin"),
  sellerReject,
);

// seller
router.post("/seller_login", sellerLogin);
router.post("/seller_register", sellerRegister);

// user
router.get("/get_user", verifyToken, get_user);
router.post("/user_register", userRegister);
router.post("/user_login", userLogin);
export default router;
