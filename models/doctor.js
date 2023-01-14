import mongoose from "mongoose";

const doctorSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    specialty: { type: String },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
