import mongoose from "mongoose";

const typeSchema = mongoose.Schema(
  {
    name: String,
    duration: { type: Number, default: 30 },
    color: { type: String, default: "#056ab1" },
    online: { type: Boolean, default: true },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
  },
  { timestamps: true }
);

var Type = mongoose.model("Type", typeSchema);

export default Type;
