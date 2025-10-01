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
    ref: "User",
    required: true,
  },

  location: {
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    coordinates: {
      type: [Number],
    },
  },

  views: {
    type: Number,
    default: 0,
  },

  creationdate: {
    type: Date,
    default: Date.now,
  },

  image: {
    type: String,
  },

  status: {
    type: String,
    default: "inactive",
  },

  url: {
    type: String,
  },

  category: {
    type: [String],
    default: [],
  },

  age: {
    type: [String],
    default: [],
  },

  type: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
