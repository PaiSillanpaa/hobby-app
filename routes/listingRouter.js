import express from "express";
import {
  createListing,
  getListings,
} from "../controllers/listingControllers.js";
import { get } from "mongoose";
import { checkJwt } from "../middleware/jwt.js";

const listingRouter = express.Router();

// listing routers
listingRouter.post("/create", createListing);
listingRouter.get("/listings", checkJwt, getListings);

export default listingRouter;
