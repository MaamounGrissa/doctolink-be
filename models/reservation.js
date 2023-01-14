import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    startDate: String,
    endDate: String,
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
    },
    patient: { type: String, default: "" },
    status: { type: String, default: "FREE" },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
