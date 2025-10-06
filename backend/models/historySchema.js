import mongoose, { mongo } from "mongoose";

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },

  creationdate: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model("History", historySchema);

export default History;
