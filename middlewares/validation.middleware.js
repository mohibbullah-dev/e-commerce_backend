import { ZodError } from "zod";
import { apiError } from "../utils/api.error.js";

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = schema.parse(req[source]);

      if (source === "query") {
        req.validedQuery = data;
      } else {
        req[source] = data;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = error.issues.map((err) => {
          return { field: err.path.join("."), message: err.message };
        });
        return next(new apiError(400, "validation error", formattedError));
      }

      return next(new apiError(500, "server error", error.message));
    }
  };
};

export default validate;
