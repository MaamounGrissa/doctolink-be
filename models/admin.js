import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
