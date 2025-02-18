import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  name: {type: String, required: true},
  company: {type: String, required: true},
  position: {type: String, required: true},
  description:{type:String, required:true},
  questions:{type:[String], required:true},
  tags:{type:[String]},
  salary: {type: Number, required: true},
})

export default mongoose.model("internSchema",internSchema);