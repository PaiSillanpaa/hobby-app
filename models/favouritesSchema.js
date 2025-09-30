import mongoose from "mongoose";

const favouritesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  creationdate: {
    type: Date,
    default: Date.now,
  },
});

favouritesSchema.index({ userId: 1, listingId: 1 }, { unique: true });

const Favourites = mongoose.model("Favourites", favouritesSchema);

export default Favourites;
