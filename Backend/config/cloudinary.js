// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs'
// const uploadCloudinary=async(filePath)=>{
//      cloudinary.config({ 
//         cloud_name: process.env.CLOUDDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDDINARY_API_KEY, 
//         api_secret:process.env.CLOUDDINARY_API_SECRETE,
//     });

//     try {
//         const uploadResult = await cloudinary.uploader
//       .upload(filePath)
//       fs.unlinkSync(filePath)
//       return uploadResult.secure_url;

//     } catch (error) {
//           fs.unlinkSync(filePath)
//           return res.status(500).json({message:"cloudinary error "})
//     }
 
// }
// export default uploadCloudinary;
 

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    console.log(result)
    return result.secure_url;

  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadCloudinary;
