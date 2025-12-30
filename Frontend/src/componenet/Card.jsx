import React, { useContext } from 'react'
import { UserDataContext } from '../context/userContext';

const Card = ({image}) => {
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
  return (
    <div className={ `w-[70px] h-[120px] lg:w-[200px] lg:h-[250px] bg-[#030326] border-2 border-[blue]
     rounded-2xl overflow-hidden  hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
     hover:border-4 hover:border-white ${selectImage==image? "border-4 border-white  hover:shadow-blue-950":null }`} 
     onClick={()=>
     { setSelectImage(image)
      setBackendImage(image),
      setFrontendImage(null)}
      
     }
      >
        <img src={image} alt="" className='h-full object-cover '/>
    </div>
  )
}

export default Card