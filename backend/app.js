import express, { json } from "express";
import "dotenv/config";
import { port } from "./config/config.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import listingRouter from "./routes/listingRouter.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true, // allow cookies
  })
);
app.use(morgan("dev"));
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

//server start function
const startServer = async () => {
  try {
    await connectDB();

    console.log("Trying to start server on port: ", port);
    app.listen(port, () => {
      console.log("listening on port: ", port);
    });
  } catch (error) {
    console.error(error.msg);
    process.exit(1);
  }
};

startServer();
