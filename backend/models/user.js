import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "agent", "admin"], default: "student" },
  interestedtags: { type: [String] },
});


export default mongoose.model("User", userSchema);