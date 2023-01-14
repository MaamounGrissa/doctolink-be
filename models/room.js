import mongoose from "mongoose";
import messagesSchema from "./message.js";

const roomSchema = mongoose.Schema(
  {
    establishment: { type: mongoose.Types.ObjectId, ref: "Establishment" },
    patient: { type: mongoose.Types.ObjectId, ref: "User" },
    messages: [messagesSchema],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
