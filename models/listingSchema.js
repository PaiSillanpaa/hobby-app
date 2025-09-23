import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  listingTitle: {
    type: String,
    required: true,
  },

  listingDesc: {
    type: String,
  },

  userId: {
    type: mongoose.ObjectId,
    required: true,
  },

  location: {
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    coordinate: {
      type: [Number],
    },
  },

  views: {
    type: Number,
    default: 0,
  },

  tags: {
    type: [String],
    default: [],
  },

  image: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
