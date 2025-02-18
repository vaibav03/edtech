import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
export async function mongoconnect() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MONGODB')
  } catch (e) {
    console.log("error in connecting to db", e);
  }
}
