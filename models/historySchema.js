import mongoose, { mongo } from "mongoose";

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  listinId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const History = mongoose.model("History", historySchema);

export default History;
