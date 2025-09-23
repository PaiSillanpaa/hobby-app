import express from "express";
import {
  createListing,
  getListings,
  imageTest,
  getListingsByTags,
} from "../controllers/listingControllers.js";
import { get } from "mongoose";
import { checkJwt } from "../middleware/jwt.js";

const listingRouter = express.Router();

// listing routers
listingRouter.post("/listing/create", checkJwt, createListing);
listingRouter.post("/image/test", imageTest);
listingRouter.get("/listing/get", checkJwt, getListings);
listingRouter.get("/listing/get/tags", checkJwt, getListingsByTags);

export default listingRouter;
