import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { userRouter } from "./routes/user.route.js";
import geminiRespose from "./gemini.js";
dotenv.config();

const app = express();
app.use(cors(
 { origin:"https://assistant-lsmc.onrender.com"
  ,
  credentials:true
 }
))

const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get("/", async (req, res) => {
  try {
    const prompt = req.query.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const data = await geminiRespose(prompt);
    res.json(data);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
    connectDB()
  console.log(`Server started on port ${PORT}`);
  
});
