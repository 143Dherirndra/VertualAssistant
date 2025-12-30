import { response } from "express";
import uploadCloudinary from "../config/cloudinary.js";
import geminiRespose from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment/moment.js";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("get current user error:", error);
    return res.status(500).json({ message: "get current user error" });
  }
};



export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    // 1️⃣ get old user first
    const oldUser = await User.findById(req.userId);

    let assistantImage = oldUser.assistantImage;

    // 2️⃣ if new file uploaded → upload to cloudinary
    if (req.file) {
      assistantImage = await uploadCloudinary(req.file.path);
    }
    // 3️⃣ else if imageUrl exists (not empty) → use it
    else if (imageUrl) {
      assistantImage = imageUrl;
    }
    // 4️⃣ else → keep old image (do nothing)

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Assistant error" });
  }
};


//  export const  askToAssistant= async(req,res)=>{
// try {
//   const {command}= req.body;
//   const user = await User.findById(req.userId)
//   const userName= user.name;
//   const assistantName= user.assistantName;
//    const result= await geminiRespose(command,assistantName,userName);

//    const jsonMatch= result.match(/{[\s\S]*}/)

//    if(!jsonMatch){
//     return res.status(400).json({respose:"Sorry I can not UnderStand "})
//    }

//    const gemResult= JSON.parse(jsonMatch[0]);

//    const type= gemResult.type;

//    switch(type){
//       case 'get-date':
//         return res.json({
//           type,
//           userInput:gemResult.userInput,
//           response:`current date is ${moment().format('YY-MM-DD')}`

//         })
//          case 'get-time':
//         return res.json({
//           type,
//           userInput:gemResult.userInput,
//           response:`current time is ${moment().format('hh:mm  A')}`

//         })
//          case 'get-day':
//         return res.json({
//           type,
//           userInput:gemResult.userInput,
//           response:`current day is ${moment().format('dddd')}`

//         })
//          case 'get-month':
//         return res.json({
//           type,
//           userInput:gemResult.userInput,
//           response:`current month is ${moment().format('MMMM')}`

//         })

//         case 'google_search':
//         case 'youtube_search':
//         case 'youtube_play':
//         case 'calculator_open':
//         case 'instagram_open':
//         case 'facebook_open':
//          case 'weather-show':
//           return res.json({
//             type,
//             userInput:gemResult.userInput,
//             respose:gemResult.response
//           })
//           default:
//             return res.status(400).json({responsr:"I can not underStand yourInput"})
//    }

// } catch (error) {
//   return res.status(500).json({responsr:" Ask Assistant Error"})
// }
// }




export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ response: "Command is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    const userName = user.name;
    const assistantName = user.assistantName;

    // 🔹 Gemini call
    const result = await geminiRespose(command, assistantName, userName);

    // 🔐 SAFETY CHECK (IMPORTANT)
    if (!result || typeof result !== "string") {
      return res.json({
        type: "general",
        response: "AI is currently unavailable. Please try again later."
      });
    }

    // 🔹 Extract JSON from Gemini text
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.json({
        type: "general",
        response: "Sorry, I could not understand that"
      });
    }

    // 🔹 Parse JSON safely
    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("JSON Parse Error:", jsonMatch[0]);
      return res.json({
        type: "general",
        response: "AI response format error"
      });
    }

    const { type, userInput, response } = gemResult;

    // 🔹 Handle intents
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });

      case "get_time":
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });

      case "get_day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`
        });

      case "get_month":
        return res.json({
          type,
          userInput,
          response: `Current month is ${moment().format("MMMM")}`
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput,
          response
        });

      default:
        return res.json({
          type: "general",
          response: response || "I am not sure how to help with that"
        });
    }

  } catch (error) {
    console.error("Ask Assistant Error:", error);
    return res.status(500).json({
      response: "Assistant internal error"
    });
  }
};
