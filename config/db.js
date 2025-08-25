import mongoose from "mongoose";
import { mongoURI } from "./config.js";

const connectDB = async () => {
  try {
    console.log("Connecting to mongoDB...");
    await mongoose.connect(mongoURI);
    console.log("connected to mongoDB!");
  } catch (error) {
    console.error(error.msg);
    process.exit(1);
  }
};

export default connectDB;
