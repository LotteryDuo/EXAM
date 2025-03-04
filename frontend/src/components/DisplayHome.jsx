import React, { useState, useEffect, useRef } from "react";
import Input from "./Input"; // Importing the Input component

import { Wallet, User, Star, CodeSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import backgroundMusic from "../assets/sounds/background-music.mp3";
import ButtonWithSound from "./ButtonWithSound";

import { io } from "socket.io-client";
import fetchAccountData from "../utils/fetchAccountData";
import CountDown from "./CountDown";

const socket = io("http://localhost:3000");

const getToken = () => sessionStorage.getItem("token");

const getUsername = () => sessionStorage.getItem("username");

const DisplayHome = () => {
  const navigator = useNavigate();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [users, setUsers] = useState([]);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  useEffect(() => {
    // ✅ Create audio only once
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.75;

    return () => {
      // ✅ Cleanup: Stop music when component unmounts
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .catch((error) => console.error("Audio play error:", error));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const username = getUsername(); // Get the username from localStorage

    if (username) {
      socket.emit("userConnected", {
        username: username,
      });
    } else {
      console.log("⚠️ No username found in localStorage!");
    }

    const handleUsersUpdate = (onlineUsers) => {
      setUsers(onlineUsers);
    };

    const handleUserDisconnected = (disconnectedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === disconnectedUser.username
            ? { ...user, online: false } // Mark user as offline
            : user
        )
      );
    };

    // Listen for the updateOnlineUsers event from the server
    socket.on("updateOnlineUsers", handleUsersUpdate);
    socket.on("userDisconnected", handleUserDisconnected);

    // Notify the server when the user leaves the page
    window.addEventListener("beforeunload", () => {
      if (username) {
        socket.emit("userDisconnected", { username });
      }
    });

    return () => {
      socket.off("updateOnlineUsers", handleUsersUpdate); // Cleanup on unmount
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, []);

  // useEffect(() => {
  //   const loadAccountData = async () => {
  //     const data = await fetchAccountData();
  //     if (data) {
  //       setAccountData(data);
  //     } else {
  //       setError("Failed to load account data.");
  //     }
  //   };

  //   loadAccountData();
  //   setLoading(false);
  // }, []);

  const handleCardClick = (title) => {
    // Example: Navigate to a page based on the card
    if (title === "Balance") {
      navigator("/balance");
    } else if (title === "Account") {
      navigator("/account");
    } else if (title === "Lotto 6/49") {
      navigator("/lotto");
    }
  };

  const cards = [
    {
      title: "Lotto 6/49",
      value: accountData ? accountData.bet : "Loading...",
      icon: <Star className="text-yellow-500 w-8 h-8" />,
    },
    {
      title: "Balance",
      value: accountData ? `$${accountData.balance}` : "Loading...",
      icon: <Wallet className="text-green-500 w-8 h-8" />,
    },
    {
      title: "Account",
      value: accountData ? accountData.username : "Loading...",
      icon: <User className="text-blue-500 w-8 h-8" />,
    },
  ];

  // if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  // if (error) return <p className="text-center text-red-500">Error: {error}</p>;z

  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('src/assets/images/background-image.png')",
      }}
    >
      <div className="absolute top-4 left-2 px-2">
        <div className="flex items-center justify-center">
          <div
            className="p-4 px-6 py-6 mr-5 bg-center bg-no-repeat "
            style={{
              backgroundImage: "url('src/assets/images/prize.png')",
              backgroundSize: "contain", // or "cover"
            }}
          ></div>
          <h1
            style={{
              fontFamily: "'Jersey 20', sans-serif",
              backgroundColor: "#FFCF50",
              fontSize: "25px", // Set your desired px value here
            }}
            className="flex justify-left px-6 py-2 rounded-lg"
          >
            JACKPOT PRIZE: $1,500.00
          </h1>
        </div>
      </div>

      {/* ✅ Sound Toggle Button */}
      <CountDown />
      {/* <ButtonWithSound
        onClick={toggleSound}
        className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg"
      >
        {isPlaying ? "🔊 On" : "🔇 Off"}
      </ButtonWithSound> */}
      {/* <div className="bg-white shadow-md rounded-lg p-4 w-64 mb-6">
        <h2
          style={{ fontFamily: "'Jersey 20', sans-serif" }}
          className="text-lg font-semibold text-gray-700 border-b pb-2"
        >
          Online Users ( {users.length} )
        </h2>
        <ul className="mt-2 text-sm text-gray-600">
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="py-1">
                {user.username} is online 🟢
              </li>
            ))
          )}
        </ul>
      </div> */}

      <h1
        style={{ fontFamily: "'Jersey 20', sans-serif" }}
        className=" left-10  text-gray-800 text-5xl text-center font-bold mb-10  border-blue-500 pb-5 pt-10"
      >
        WINNING COMBINATIONS
      </h1>

      <div
        className="flex flex-column justify-center"
        style={{ marginTop: -40 }}
      >
        <div
          className="p-10 bg-no-repeat bg-contain  "
          style={{
            backgroundImage: "url('src/assets/images/winning-bg.png')",
          }}
        ></div>
        <div
          className="p-10 bg-no-repeat bg-contain  "
          style={{
            backgroundImage: "url('src/assets/images/winning-bg.png')",
          }}
        ></div>
        <div
          className="p-10 bg-no-repeat bg-contain  "
          style={{
            backgroundImage: "url('src/assets/images/winning-bg.png')",
          }}
        ></div>
        <div
          className="p-10 bg-no-repeat bg-contain  "
          style={{
            backgroundImage: "url('src/assets/images/winning-bg.png')",
          }}
        ></div>
        <div
          className="p-10 bg-no-repeat bg-contain  "
          style={{
            backgroundImage: "url('src/assets/images/winning-bg.png')",
          }}
        ></div>
        <div
          className="p-10 bg-no-repeat bg-contain  "
          style={{
            backgroundImage: "url('src/assets/images/winning-bg.png')",
          }}
        ></div>
      </div>

      <div className="flex items-center space-x-6">
  {/* Quantity Section */}
  <div className="flex flex-col items-center">
    <span 
      className="text-lg text-black"
      style={{ fontFamily: "'Jersey 20', sans-serif" }}
    >
      Quantity
    </span>
    <div className="flex items-center border p-2 rounded-lg mt-1">
      <button 
        onClick={decreaseQuantity} 
        className="px-3 py-1 bg-red-500 text-white rounded-l"
      >
        -
      </button>
      <span 
        className="px-4 text-black"
        style={{ fontFamily: "'Jersey 20', sans-serif" }}
      >
        {quantity}
      </span>
      <button 
        onClick={increaseQuantity} 
        className="px-3 py-1 bg-green-500 text-white rounded-r"
      >
        +
      </button>
    </div>
  </div>

  {/* Ticket Number Input */}
  <div className="flex flex-col items-center">
    <span 
      className="text-lg text-black"
      style={{ fontFamily: "'Jersey 20', sans-serif" }}
    >
      Ticket Counter
    </span>
    <Input 
      type="text" 
      placeholder="Enter ticket number" 
      className="border rounded-lg px-4 py-2 w-40 mt-1 text-black"
      style={{ fontFamily: "'Jersey 20', sans-serif"}}
    />
  </div>
</div>



    </div>
  );
};

export default DisplayHome;
