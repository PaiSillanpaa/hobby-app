import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  listingTitle: {
    type: String,
    required: true,
  },
  listingText: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  favourites: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.ObjectId,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
