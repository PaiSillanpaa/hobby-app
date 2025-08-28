import express from "express";
import { createListing } from "../controllers/listingControllers.js";

const listingRouter = express.Router();

// listing routers
listingRouter.post("/create", createListing);

export default listingRouter;
