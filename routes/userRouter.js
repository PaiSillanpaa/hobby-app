import express from "express";
import { createUser, getUser } from "../controllers/userControllers.js";

const userRouter = express.Router();

// user routes
userRouter.post("/register", createUser);

//

export default userRouter;
