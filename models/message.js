import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Types.ObjectId, ref: "User" },
    date: String,
    text: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default messageSchema;
