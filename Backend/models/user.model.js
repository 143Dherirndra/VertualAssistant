import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,        // ✅ MUST be String
      required: true,
    },

    assistantName: {
      type: String,        // ✅ name is text
      default: "",
    },

    assistantImage: {
      type: String, 
      default: "",       // ✅ image URL
    
    },

    history: [
      {
        type: String,      // ✅ conversation history
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
