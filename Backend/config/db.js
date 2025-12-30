import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ DB is connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
  }
};

export default connectDB;
