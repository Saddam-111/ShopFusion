import mongoose from "mongoose";

const DB_URL = process.env.DB_URL

export const connectDB = async (req , res) => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}