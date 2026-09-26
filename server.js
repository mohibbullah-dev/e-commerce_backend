import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import DB_Connection from "./db/index.js";
import { apiError } from "./utils/api.error.js";
import storeRouter from "./routes/store.route.js";
import categoryRouter from "./routes/category.route.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.static("public"));
app.use(cookieParser());

// router
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("route is working successfully");
});

const port = process.env.PORT || 5001;

DB_Connection()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error", error);
    });

    app.listen(port, () => {
      console.log(`server is runing on ${port}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB connection failed ${error}`);
  });

// Global error handler
app.use((err, req, res, next) => {
  let error = err;

  if (error.code === 11000) {
    const fieldName = Object.keys(error.keyValue)[0];

    if (fieldName === "email") {
      error = new apiError(
        400,
        "Unable to complete registration. Please check your details.",
        [],
        err.stack,
      );
    } else {
      const message = `This ${fieldName} is already existh, pleas try another one`;
      error = new apiError(400, message, [], err.stack);
    }
  }

  if (!(error instanceof apiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "something went wrong";
    error = new apiError(statusCode, message, error?.errors || [], err.stack);
  }

  return res.status(error.statusCode || 500).json({
    success: error.success || false,
    message: error.message,
    errors: error.errors,
  });
});
