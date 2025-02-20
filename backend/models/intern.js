import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String] },
  salary: { type: Number, required: true },
  uploadedby: { type: String, required: true },
  appliedby: { type: [Object]  }
})

export default mongoose.model("internSchema", internSchema);