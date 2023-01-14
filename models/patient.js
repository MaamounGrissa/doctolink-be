import mongoose from "mongoose";

const patientSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    establishments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Establishment",
      },
    ],
    isActive: { type: Boolean, default: true },
    sex: String,
    securityNumber: String,
    paymentCenter: String,
    birthday: String,
    fixNumber: String,
    adress: String,
    information: String,
    blacklisted: [String],
  },
  { timestamps: true }
);
const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
