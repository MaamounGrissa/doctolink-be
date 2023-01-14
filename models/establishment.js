import mongoose from "mongoose";

const establishmentSchema = mongoose.Schema(
  {
    name: String,
    phone: String,
    adress: String,
    postalCode: String,
    city: String,
    specialty: { type: String },
    startHour: { type: Number, min: 0, max: 23, default: 8 },
    endHour: { type: Number, min: 0, max: 23, default: 18 },
    weekend: [Number],
  },
  { timestamps: true }
);

var Establishment = mongoose.model("Establishment", establishmentSchema);

export default Establishment;
