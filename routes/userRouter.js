import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  changePassword,
  getUserInfo,
  updateUser,
  getUsers,
  logoutUser,
} from "../controllers/userControllers.js";
import { checkJwt } from "../middleware/jwt.js";

const userRouter = express.Router();

// user routes
userRouter.get("/info", checkJwt, getUserInfo);
userRouter.get("/users", checkJwt, getUsers);

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", checkJwt, logoutUser);

userRouter.put("/:id/update", checkJwt, updateUser);
userRouter.patch("/change-password", checkJwt, changePassword);

userRouter.delete("/:id/delete", checkJwt, deleteUser);

export default userRouter;
