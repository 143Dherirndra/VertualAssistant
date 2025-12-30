import React, { useContext, useState } from "react";
import bg from "../assets/BackgroundImahe.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/userContext";
import axios from "axios";

const Login = () => {
  const { serverUrl,userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signIn`, // ✅ must match backend
        { email, password },
        { withCredentials: true }
      );

      setUserData(res.data)
      // navigate("/dashboard"); // enable when dashboard exists
    } catch (err) {
      console.log(err);
      setUserData(null)
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      navigate('/')
    }
  };

  return (
    <div
      className="w-full h-screen bg-no-repeat bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-[90%] h-[700px] max-w-[500px] bg-[#00000000]
        backdrop-blur-md shadow-lg shadow-blue-950 flex flex-col
        justify-center items-center gap-[20px]"
      >
        <h1 className="text-white text-[30px] font-semibold">
          Login To <span className="text-blue-400">VertualAssistant</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full h-[60px] border-2 border-white bg-transparent
          text-white placeholder-gray-300 rounded-full px-[20px] outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="w-full h-[60px] border-2 border-white rounded-full
        flex items-center px-[20px] relative text-white">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-full bg-transparent outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!showPassword ? (
            <FaEye
              className="absolute right-[25px] cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <FaEyeSlash
              className="absolute right-[25px] cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {error && <p className="text-red-400 text-sm">*{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`min-w-[150px] h-[50px] rounded-full font-semibold text-[18px]
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-white text-black"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="text-white cursor-pointer text-[16px]"
          onClick={() => navigate("/signup")}
        >
          Create an Account ::
          <span className="text-blue-400"> Signup</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
