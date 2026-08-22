import express from "express";
import "dotenv/config";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to backend");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is runing on ${port}`);
});
