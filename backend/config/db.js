import mongoose from "mongoose";

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/shopfusion'

export const connectDB = async (req , res) => {
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}