import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    establishment: { type: mongoose.Types.ObjectId, ref: "Establishment" },
    type: String,
    startDate: String,
    motif: String,
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    doctor: String,
    appointment: { type: mongoose.Types.ObjectId, ref: "Appointment" },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
