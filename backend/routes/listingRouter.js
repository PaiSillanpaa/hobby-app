import express from "express";
import {
  createListing,
  getAllListings,
  getInactiveListings,
  getActiveListings,
  getDeletedListings,
  getListingsByTags,
  getCategories,
  getFavourites,
  getHistory,
  setFavourite,
  removeFavourite,
  addToHistory,
  updateListing,
  setListingActive,
  setListingDeleted,
  setListingInactive,
  deleteListing,
} from "../controllers/listingControllers.js";
import { get } from "mongoose";
import { checkJwt } from "../middleware/jwt.js";
import upload from "../middleware/multer.js";

const listingRouter = express.Router();

// listing routers

listingRouter.get("/all", checkJwt, getAllListings);
listingRouter.get("/active", checkJwt, getActiveListings);
listingRouter.get("/inactive", checkJwt, getInactiveListings);
listingRouter.get("/deleted", checkJwt, getDeletedListings);
listingRouter.get("/categories", getCategories);
listingRouter.get("/favourites", checkJwt, getFavourites);
listingRouter.get("/history", checkJwt, getHistory);

listingRouter.post("/create", checkJwt, upload.single("image"), createListing);
listingRouter.post("/favourite", checkJwt, setFavourite);
listingRouter.post("/remove-favourite", checkJwt, removeFavourite);
listingRouter.post("/history", checkJwt, addToHistory);
listingRouter.post("/tags", getListingsByTags);

listingRouter.put("/:id/update", checkJwt, updateListing);
listingRouter.patch("/:id/status/active", checkJwt, setListingActive);
listingRouter.patch("/:id/status/inactive", checkJwt, setListingInactive);
listingRouter.patch("/:id/status/deleted", checkJwt, setListingDeleted);

listingRouter.delete("/:id/delete", checkJwt, deleteListing);

export default listingRouter;
