import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    startDate: { type: String },
    endDate: { type: String },
    notes: { type: String },
    cancelDemand: { type: Boolean, default: false },
    status: { type: String, default: "WAITING" }, // "WAITING" or "CONFIRMED" or "CANCELED" or "MISSED"
    calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar" },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
    motif: { type: String },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
