import internSchema from '../models/intern.js';
import mongoose, { deleteModel } from "mongoose";
import user from '../models/user.js';

export async function uploadedinternships(req, res) {
  try {
    console.log("getinternships");
    const { uploadedby } = req.query;
    console.log(uploadedby);
    const internships = await internSchema.find({ uploadedby });
    console.log(internships);
    return res.status(201).json({ internships });
  } catch (e) {
    console.log("getinternships", e);
    return res.status(500).json({ error: "Cannot get internships" });
  }
}

export async function addinternship(req, res) {
  try {
    const { uploadedby } = req.query;
    const { name, company, position, description, tags, salary } = req.body;
    const internship = new internSchema({ name, company, position, description, tags, salary, uploadedby });
    await internship.save();
    return res.status(201).json({ message: "Internship added successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Cannot add internship" });
  }
}

export async function deleteinternship(req, res) {
  try {
    const { name, uploadedby } = req.body;
    const internship = await internSchema.findOne({ name: name, uploadedby: uploadedby });
    await internSchema.deleteOne({ _id: internship._id });
    return res.status(201).json({ message: "Internship deleted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Cannot delete internship" });
  }
}