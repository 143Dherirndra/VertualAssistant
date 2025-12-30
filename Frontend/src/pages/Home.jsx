import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🔒 Prevent multiple Gemini calls
let isProcessing = false;

const Home = () => {
  const {
    userData,
    backendImage,
    serverUrl,
    setUserData,
    getgeminiRespose
  } = useContext(UserDataContext);

  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [response, setResponse] = useState("");

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const manualStopRef = useRef(false);

  const synth = window.speechSynthesis;

  // 🔊 Speak
  const speak = (text) => {
    if (!text) return;

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      startRecognition();
    };

    synth.speak(utterance);
  };

  // 🎤 Start mic safely
  const startRecognition = () => {
    if (
      recognitionRef.current &&
      !isSpeakingRef.current &&
      !isRecognizingRef.current
    ) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  // 🔗 SAFE open in new tab (popup-safe trick)
  const openInNewTab = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 🚀 HANDLE COMMAND
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    setResponse(response)

    speak(response);

    switch (type) {
      case "instagram_open":
        openInNewTab("https://www.instagram.com/");
        break;

      case "facebook_open":
        openInNewTab("https://www.facebook.com/");
        break;

      case "google_search":
        openInNewTab(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`
        );
        break;

      case "youtube_search":
      case "youtube_play":
        openInNewTab(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userInput
          )}`
        );
        break;

      case "calculator_open":
        openInNewTab("https://www.google.com/search?q=calculator");
        break;

      case "weather_show":
        openInNewTab(
          `https://www.google.com/search?q=${encodeURIComponent(
            userInput || "weather"
          )}`
        );
        break;

      default:
        break;
    }

    setTimeout(() => {
      isProcessing = false;
    }, 1000);
  };

  // 🔓 Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/LogOut`, {
        withCredentials: true
      });
      setUserData(null);
      navigate("/login");
    } catch {
      setUserData(null);
    }
  };

  // 🎧 Speech Recognition
  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("🎤 Listening...");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (manualStopRef.current) {
        manualStopRef.current = false;
        return;
      }

      if (!isSpeakingRef.current) {
        setTimeout(startRecognition, 800);
      }
    };

    recognition.onerror = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(startRecognition, 800);
      }
    };

    recognition.onresult = async (e) => {
      if (isProcessing) return;

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      ) {
        isProcessing = true;

        manualStopRef.current = true;
        recognition.stop();
        setListening(false);

        const raw = await getgeminiRespose(transcript);
        console.log("🔥 GEMINI RAW RESPONSE:", raw);

        let data;
        try {
          data = typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          speak("Sorry, I did not understand.");
          isProcessing = false;
          return;
        }

        if (data?.type) {
          handleCommand(data);
        } else {
          speak("Please try again.");
          isProcessing = false;
        }
      }
    };

    startRecognition();

    return () => {
      manualStopRef.current = true;
      recognition.stop();
      setListening(false);
    };
  }, [userData]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02025200] flex flex-col justify-center items-center px-4">
      <button
        onClick={handleLogOut}
        className="text-2xl my-4 bg-white rounded-full px-6 py-2 font-bold"
      >
        Logout
      </button>

      <button
        onClick={() => navigate("/customized")}
        className="text-2xl my-4 bg-white rounded-full px-6 py-2 font-bold"
      >
        Change Assistant Image
      </button>

      <div className="h-[400px] w-[300px] bg-gray-800 rounded-3xl overflow-hidden shadow-lg">
        <img
          src={backendImage}
          alt="Assistant"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-white text-3xl mt-6">
        Hello {userData?.assistantName}
      </h1>
      <h1 className="text-red-300 text-2xl">{response}</h1>

      {listening && (
        <p className="text-green-400 mt-2">🎤 Listening...</p>
        
      )}
      
     
    </div>
  );
};

export default Home;


