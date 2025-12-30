

import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoArrowBack } from "react-icons/io5";

const Customized2 = () => {
const {
  userData,
  setUserData,
  selectedImage,
  serverUrl,
  backendImage
} = useContext(UserDataContext);


const [assistant, setAssistant] = useState("")
const navigate = useNavigate()


const handleUpdateImage = async () => {
  try {
    const formData = new FormData();

    formData.append("assistantName", assistant);

    if (backendImage) {
      formData.append("assistantImage", backendImage);
    } else {
      formData.append("imageUrl", selectedImage);
    }

    const result = await axios.post(
      `${serverUrl}/api/user/update`,
      formData,
      {
        withCredentials: true, // ✅ VERY IMPORTANT
      }
    );

    
    const updatedUser = result.data;

setUserData(prev => ({
  ...prev,
  ...updatedUser
}));

navigate("/");

  } catch (error) {
    console.log("Update error:", error.response?.data || error.message);
  }
};

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020252fa]
      flex flex-col justify-center items-center px-4">
   <IoArrowBack onClick={()=>navigate("/customized")} 
   className='text-white top-[30px] left-[30px] cursor-pointer text-5xl absolute' />

      <h1 className="text-white text-3xl font-semibold mb-6 text-center">
        Enter your <span className="text-blue-300">AI Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg. ultron"
        className="w-full max-w-[600px] text-white px-4 rounded-full
        h-[60px] border-2 border-white bg-transparent"
        value={assistant}
        onChange={(e) => setAssistant(e.target.value)}
      />

      {/* ✅ Button appears when input has value */}
      {assistant.trim() && (
        <button
          className="min-w-[300px] h-[50px] rounded-full mt-10 cursor-pointer
          font-semibold text-[18px] text-white bg-blue-600 hover:bg-blue-700 transition"
          onClick={() => {handleUpdateImage()}}
        >
          Finally Create your Assistant
        </button>
      )}

    </div>
  )
}

export default Customized2
