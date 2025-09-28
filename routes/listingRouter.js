import express from "express";
import {
  createListing,
  getListings,
  imageTest,
  getListingsByTags,
  getCategories,
} from "../controllers/listingControllers.js";
import { get } from "mongoose";
import { checkJwt } from "../middleware/jwt.js";

const listingRouter = express.Router();

// listing routers
listingRouter.post("/listing/create", checkJwt, createListing);
listingRouter.post("/image/test", imageTest);
listingRouter.get("/listing/get", getListings);
listingRouter.get("/listing/get/tags", getListingsByTags);
listingRouter.get("/listing/get/categories", getCategories);

export default listingRouter;
