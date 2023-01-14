import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, default: "PATIENT" },
  avatar: { type: String, default: "" },
  token: { type: String, default: "" },
});

export default mongoose.model("User", userSchema);
 