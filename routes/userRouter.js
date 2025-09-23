import express from "express";
import { createUser, loginUser } from "../controllers/userControllers.js";

const userRouter = express.Router();

// user routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
