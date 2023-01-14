import mongoose from "mongoose";

const demandSchema = new mongoose.Schema(
  {
    calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
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

const Demand = mongoose.model("Demand", demandSchema);
export default Demand;
