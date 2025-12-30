import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
const [selectImage,setSelectImage]=useState()
 const serverUrl = "https://vertualassistant-1b.onrender.com";


  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );

      setUserData(result.data);
      console.log("Current User:", result.data);
    } catch (error) {
      console.log("User not logged in");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

 const getgeminiRespose = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/askassistant`, // ✅ FIXED
      { command },
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    loading,
    frontendImage,
     setFrontendImage,
     backendImage, 
     setBackendImage,
     selectImage,
     setSelectImage,
     getgeminiRespose
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
