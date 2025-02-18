import express from "express";
import bcrypt from "bcrypt"
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
const secret_key = process.env.SECRET_KEY
const router = express.Router();

export async function register(req, res) {
  try {
    const { username, email, password, role, interestedtags } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, interestedtags })
    await user.save();
    return res.status(200).json({ message: "Registration Success" })
  } catch (e) {
    res.status(500).json({ error: "Registration failed" })
    console.log(e);
  }
}


export async function login(req, res) {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid User" });

    const passwordmatch = await bcrypt.compare(password, user.password);

    if (!passwordmatch)
      return res.status(401).json({ error: "Authentication Failed" });

    const token = jwt.sign({ userId: user.id, role: user.role }, secret_key, {
      expiresIn: '1h',
    })
    res.status(200).json({ token, user })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: "Login failed" })
  }
}