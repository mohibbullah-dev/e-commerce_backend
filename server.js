import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import DB_Connection from "./db/index.js";
import { apiError } from "./utils/api.error.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/v1/auth", userRoute);

app.get("/", (req, res) => {
  res.send("route is working successfully");
});

const port = process.env.PORT || 5000;

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

  if (!(error instanceof apiError)) {
    const statusCode = error.statusCode;
    const message = error.message || "something went wrong";
    error = new apiError(statusCode, message, error?.errors || [], err.stack);
  }

  return res.status(error.statusCode || 500).json({
    success: error.success || false,
    message: error.message,
    errors: error.errors,
  });
});
