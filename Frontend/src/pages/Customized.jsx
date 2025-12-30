// import React, { useRef, useState } from "react";
// import image1 from "../assets/image1.png";
// import image2 from "../assets/image2.jpg";
// import image4 from "../assets/image4.png";
// import image5 from "../assets/image5.png";
// import image6 from "../assets/image6.jpeg";
// import image7 from "../assets/image7.jpeg";
// import { LuImageDown } from "react-icons/lu";
// import Card from "../componenet/Card";

// const Customized = () => {
//   const [frontendImage, setfrontendImage] = useState(null)
//   const [backendImage, setbackendImage] = useState(null)
//   const inputImage=useRef()
//   return (
//     <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020252fa] flex flex-col justify-center items-center px-4">
      
//       <h1 className="text-white text-3xl font-semibold mb-6 text-center">
//         Welcome to your <span className="text-blue-300">AI Assistant</span>
//         Select Ai Image
//       </h1>

//       <div className="w-full max-w-5xl flex justify-center items-center flex-wrap gap-5 mb-8" >
//         <Card image={image1} />
//         <Card image={image2} />
//         <Card image={image4} />
//         <Card image={image5} />
//         <Card image={image6} />
//         <Card image={image7} />
//       </div>

//       <div
//         className="w-[70px] h-[120px] lg:w-[200px] lg:h-[250px] bg-[#030326] 
//         border-2 border-blue-500 rounded-2xl overflow-hidden 
//         hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
//         hover:border-4 hover:border-white flex items-center justify-center mb-6"
//         onClick={()=>inputImage.current.click()}
//       >
//         <LuImageDown className="w-6 h-6 text-white" />
//         <input type="image/*" ref={inputImage} hidden />
//       </div>

//       <button className="min-w-[150px] h-[50px] rounded-full font-semibold text-[18px] text-white bg-blue-600 hover:bg-blue-700 transition">
//         Next
//       </button>
//     </div>
//   );
// };

// export default Customized;

import React, { useContext, useRef, useState } from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { LuImageDown } from "react-icons/lu";
import Card from "../componenet/Card";
import UserContext, { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
const Customized = () => {
const {serverUrl,
    userData,
    setUserData,
    loading,
    frontendImage,
     setFrontendImage,
     backendImage, 
     setBackendImage,
     selectImage,
     setSelectImage}=useContext(UserDataContext);

  const inputImage = useRef(null);
  const navigate=useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file); // for backend upload
    setFrontendImage(URL.createObjectURL(file)); // for preview
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black
     to-[#020252fa] flex flex-col justify-center items-center px-4">
        <IoArrowBack onClick={()=>navigate("/")} 
         className='text-white top-[30px] left-[30px] cursor-pointer text-5xl absolute' />

      <h1 className="text-white text-3xl font-semibold mb-6 text-center">
        Welcome to your <span className="text-blue-300">AI Assistant</span><br />
        Select AI Image
      </h1>

      <div className="w-full max-w-5xl flex justify-center items-center flex-wrap gap-5 mb-8">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
      </div>

      {/* Upload Box */}
      <div
        className={`"w-[70px] h-[120px] lg:w-[200px] lg:h-[250px] bg-[#030326]
        border-2 border-blue-500 rounded-2xl overflow-hidden
        hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
        hover:border-4 hover:border-white flex items-center justify-center mb-6  ${selectImage=="input"? "border-4 border-white  hover:shadow-blue-950":null } `}
        onClick={() => {inputImage.current.click()
          setSelectImage('input')
        }}
      >
        {frontendImage ? (
          <img
            src={frontendImage}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <LuImageDown className="w-6 h-6 text-white" />
        )}

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImageChange}
        />
      </div>
   {
    selectImage &&
     <button className="min-w-[150px] h-[50px] rounded-full font-semibold text-[18px] text-white bg-blue-600 hover:bg-blue-700 transition"
     onClick={()=>navigate('/customized2')}>
        Next
      </button>
   }
     
    </div>
  );
};

export default Customized;

