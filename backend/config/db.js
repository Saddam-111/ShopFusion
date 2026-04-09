import mongoose from "mongoose";

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/shopfusion'

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}