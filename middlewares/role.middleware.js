import { apiError } from "../utils/api.error.js";

const authorizedRoole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user?.role)) {
      next(
        new apiError(
          403,
          `Role: ${req.user?.role} || "user" is not allowed to access this resource`,
        ),
      );
    }
    next();
  };
};
export default authorizedRoole;
