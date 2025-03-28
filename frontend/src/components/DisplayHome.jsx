import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Wallet, User, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backgroundMusic from "../assets/sounds/background-music.mp3";
import { io } from "socket.io-client";
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
  const [lottoInput, setLottoInput] = useState("");
  const [fontSize, setFontSize] = useState("2rem");

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
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.75;

    return () => {
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
    const username = getUsername();

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
            ? { ...user, online: false }
            : user
        )
      );
    };

    socket.on("updateOnlineUsers", handleUsersUpdate);
    socket.on("userDisconnected", handleUserDisconnected);

    window.addEventListener("beforeunload", () => {
      if (username) {
        socket.emit("userDisconnected", { username });
      }
    });

    return () => {
      socket.off("updateOnlineUsers", handleUsersUpdate);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, []);

  useEffect(() => {
    const updateFontSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setFontSize("1.2rem"); // Mobile
      } else if (screenWidth < 900) {
        setFontSize("1.5rem"); // Tablet
      } else {
        setFontSize("2rem"); // Desktop
      }
    };

    window.addEventListener("resize", updateFontSize);
    updateFontSize(); // Run on initial load

    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);

  const handleCardClick = (title) => {
    if (title === "Balance") {
      navigator("/balance");
    } else if (title === "Account") {
      navigator("/account");
    } else if (title === "Lotto 6/49") {
      navigator("/lotto");
    }
  };

  const handleLottoInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue =
      rawValue
        .slice(0, 12)
        .match(/.{1,2}/g)
        ?.join(" - ") || "";

    setLottoInput(formattedValue);
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

  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat centered p-0 m-0"
      style={{
        backgroundImage: "url('src/assets/images/bg-main-page.png')",
        backgroundColor: "#F0E5C9",
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        marginTop: "0px",
      }}
    >
      <div
        className="absolute"
        style={{
          backgroundImage: "url('src/assets/images/final-logo.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          top: "10px",
          left: "1%",
          width: "200px",
          height: "50px",
          zIndex: "10",
        }}
      ></div>

      <div className="absolute top-[70px] flex sm:flex-row flex-col sm:justify-start sm:items-center mobile-center px-4">
        <h1
          style={{
            fontFamily: "'Jersey 20', sans-serif",
            backgroundColor: "#E8AC41",
            fontSize: fontSize, 
            padding: "0.5rem 1rem", 
          }}
          className="rounded-lg text-left sm:text-left"
        >
          JACKPOT PRIZE: $1,500.00
        </h1>
      </div>

      <div className="flex justify-center">
        <CountDown />
      </div>

      <div className="flex justify-center">
        <WinningCombinationsTitle
          className="text-gray-800 text-center font-bold mb-10 border-blue-500 pb-5 pt-10 sm:mt-[5%]"
          style={{
            marginTop: window.innerWidth <= 600 ? "130px" : "2.5rem", 
          }}
        >
          WINNING COMBINATIONS
        </WinningCombinationsTitle>
      </div>

      <div
        className="flex justify-center items-center"
        style={{ marginTop: -60, marginLeft: "20px", marginRight: "20px" }}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-[120px] bg-no-repeat bg-contain m-2"
            style={{
              backgroundImage: "url('src/assets/images/winning-bg.png')",
              fontFamily: "'Jersey 20', sans-serif",
            }}
          >
            <p
              className="text-[3rem] md:text-[6rem] lg:text-[6.8rem] text-black leading-tight flex justify-center items-center w-full"
              style={{ margin: 0, padding: 0 }}
            >
              12
            </p>
          </div>
        ))}
      </div>

      <div
        className="flex h-auto justify-between flex-col md:flex-row"
        style={{
          gap: "0", 
          marginLeft: window.innerWidth <= 600 ? "50%" : "23%", 
          marginRight: window.innerWidth <= 600 ? "10px" : "5%", 
        }}
      >
        <div
          className="flex flex-col lg:ml-80 ml-0 frame-left"
          style={{
            marginLeft: window.innerWidth <= 600 ? "10px" : "0", 
            marginRight: window.innerWidth <= 600 ? "10px" : "10%", 
            // Add margin-left for mobile
          }}
        >
          <div className="flex w-[300px] mt-1 h-[50px] justify-between">
            <span
              className="text-black"
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
            >
              TICKET COUNTER:
            </span>
            <span
              className="text-black"
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
            >
              0
            </span>
          </div>
          <div className="flex justify-between items-center w-[300px] h-[60px]">
            <p
              className="justify-left text-left text-black"
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
            >
              QUANTITY:
            </p>
            <div className="flex items-center justify-center p-2 rounded-lg mt-1 ml-12 space-x-2">
              <button
                onClick={decreaseQuantity}
                className="py-1 px-3 bg-[#EEEEEE] text-black text-[28px]"
              >
                -
              </button>
              <p
                className="w-9 h-10 flex items-center justify-center text-black bg-[#FFFFFF] text-center rounded"
                style={{
                  fontFamily: "'Jersey 20', sans-serif",
                  fontSize: "2rem",
                }}
              >
                {quantity}
              </p>
              <button
                onClick={increaseQuantity}
                className="py-1 px-2 bg-[#EEEEEE] text-black text-[28px]"
              >
                +
              </button>
            </div>
          </div>

          <div className="relative w-full mt-3 h-auto ">
            <div
              className="absolute right-0 w-[200px] h-[50px] rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "#D01010",
                fontFamily: "'Jersey 20', sans-serif",
              }}
            >
              <p className="text-[2rem] text-center mt-0 cursor-pointer">
                TOP UP
              </p>
            </div>
          </div>

          <div className="flex w-full mt-16">
            <p
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
              className="flex justify-left text-black"
            >
              WALLET BALANCE:
            </p>
          </div>

          <div
            style={{
              fontFamily: "'Jersey 20', sans-serif",
              backgroundColor: "#41644A",
              borderRadius: "10px",
              width: window.innerWidth <= 600 ? "60%" : "100%", // Reduce width for mobile
            }}
          >
            <div className="flex flex-row items-center">
              <div
                className="ml-2 bg-center bg-no-repeat"
                style={{
                  width: window.innerWidth <= 600 ? "60px" : "80px", // Reduce width for mobile
                  height: window.innerWidth <= 600 ? "60px" : "80px", // Reduce height for mobile
                  backgroundImage: "url('src/assets/images/money-img.png')",
                  backgroundSize: "contain",
                }}
              ></div>
              <p
                className="ml-2 text-center text-white"
                style={{
                  fontSize: window.innerWidth <= 600 ? "24px" : "36px", // Adjust font size for mobile
                }}
              >
                $ 1500.00
              </p>
            </div>
          </div>

          <div
            style={{
              fontFamily: "'Jersey 20', sans-serif",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            <div className="flex w-full mt-2">
              <p
                style={{
                  fontFamily: "'Jersey 20', sans-serif",
                  fontSize: "2rem",
                }}
                className="flex justify-left text-black"
              >
                PREVIOUS BET:
              </p>
            </div>

            <div
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                backgroundColor: "#41644A",
                borderRadius: "10px",
                height: "60%",
                width: window.innerWidth <= 600 ? "80%" : "100%",
              }}
            >
              <div className="flex flex-row items-center w-full mt-2">
                <p
                  style={{
                    fontFamily: "'Jersey 20', sans-serif",
                    fontSize: "2rem",
                  }}
                  className="ml-7 text-center text-white"
                >
                  02-01-09-11-13-45
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col lg:mr-80 mr-0 ml-10 text-white frame-right"
          style={{ fontFamily: "'Jersey 20', sans-serif" }}
        >
          <div className="mt-5 mr-20">
            <p
              className="text-black"
              style={{ fontSize: "2rem", margin: "0px" }}
            >
              Enter Lotto Bet:
            </p>
            <input
              type="text"
              placeholder="00-00-00-00-00-00"
              value={lottoInput}
              onChange={handleLottoInputChange}
              className="w-full p-2 border-b-2 border-black bg-transparent text-black focus:outline-none"
              style={{ fontSize: "2.5rem", marginTop: "0px" }}
            />
          </div>

          <div className="flex mt-5 mr-16 relative items-center justify-center">
            <Button
              className="w-80 text-[2rem] py-2 px-4"
              style={{ backgroundColor: "#D01010" }}
            >
              PLACE BET
            </Button>
          </div>

          <div className="flex mt-5 mr-16 relative items-center justify-center">
            <Button
              className="w-80 text-[2rem] py-2 px-4"
              style={{ backgroundColor: "#41644A" }}
            >
              WITHDRAW CASH
            </Button>
          </div>

          <div className="flex mt-5 mr-16 relative items-center justify-center">
            <Button
              className="w-80 text-[2rem] py-2 px-4"
              style={{ backgroundColor: "#41644A" }}
            >
              HISTORY
            </Button>
          </div>

          <div className="flex w-[340px] mt-[10px] text-[24px] h-auto justify-between">
            <div>
              <p
                style={{ backgroundColor: "#C14600" }}
                className="w-[150px] text-center rounded-lg"
              >
                GAMBLERS (2)
              </p>
            </div>
            <div>
              <p
                style={{ backgroundColor: "#41644A" }}
                className="w-[150px] text-center rounded-lg"
              >
                user_nemo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Button = styled.button`
  --bg: #000;
  --hover-bg: #fff;
  --hover-text: #000;
  color: #fff;
  cursor: pointer;
  border: 1px solid var(--bg);
  border-radius: 4px;
  padding: 0.3em 2em;
  background: var(--bg);
  transition: 0.2s;

  &:hover {
    color: #fff;
    transform: translate(-0.5rem, -0.5rem);
    background: var(--hover-bg);
    box-shadow: 0.5rem 0.5rem var(--bg),
      0.75rem 0.75rem rgba(255, 255, 255, 0.2); /* Stronger shadow */
  }

  &:active {
    transform: translate(0);
    box-shadow: none;
  }
`;

const JackpotPrize = styled.h1`
  font-family: "Jersey 20", sans-serif;
  background-color: #e8ac41;
  font-size: 2rem;
  margin-top: 0;

  @media screen and (max-width: 425px) {
    font-size: 6rem;
    margin-top: 90%;
  }
`;

const WinningCombinationsTitle = styled.h1`
  font-family: "Jersey 20", sans-serif;
  font-size: 3rem;
  margin-top: 2.5rem;
  align-items: center;
  margin-left: 30%;
  margin-right: 30%;
  line-height: 1;

  @media screen and (max-width: 425px) {
    margin-top: 150px; /* Ensure proper margin-top for mobile view */
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  @media screen and (min-width: 320px) and (max-width: 599px) {
    .mobile-bg {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 100vh;
      width: 100vw;
    }
    
    .winning-bg p {
      margin-top: 0 !important;
    }

    .rounded-lg {
      width: 90%;
      margin: 0 auto;
      padding: 1rem;
      margin-top: 6rem;
    }

    .absolute div {
      width: 120px;
      height: 120px;
    }

    .absolute div:nth-child(2) {
      width: 250px;
      height: 100px;
    }

    .flex {
      flex-direction: column;
      align-items: center;
    }

    .gap-8 {
      gap: 1rem;
    }

    .text-center {
      font-size: 0.8rem; /* Smaller text for mobile */
    }

    .input-container {
      max-width: 100%;
    }

    .input-container input {
      font-size: 1rem; /* Smaller text for mobile */
    }

    .input-container .label {
      font-size: 1rem; /* Smaller text for mobile */
    }

    .input-container input:focus ~ .label,
    .input-container input:valid ~ .label {
      font-size: 0.8rem; /* Smaller text for mobile */
    }

    .input-container input:hover {
      border-bottom: 2px solid #555;
    }

    .flex.mb-3.relative.items-center.justify-center {
      margin-top: 1rem;
    }

    .absolute {
      right: 10%;
      top: 30%;
    }

    .h1 {
      margin-top: 100%;
    }

    .h1, p, span, button {
      font-size: 0.8rem !important;
    }
  }

  @media screen and (min-width: 600px) and (max-width: 899px) {
    .centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-left: 0;
      background-size: cover !important;
      background-position: center !important;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .winning-bg p {
      margin-top: 10px;
    }

    .frame-content {
      margin-left: 0 !important;
    }

    .frame-left {
      margin-left: 0 !important;
    }

    .frame-right {
      margin-right: 0 !important;
    }

    .absolute, .relative {
      padding: 0 !important;
      margin: 0 !important;
    }

    .frame {
      width: 100%;
      padding: 0 1rem;
    }

    .centered h1,
    .centered p,
    .centered div {
      margin: 0 auto;
    }

    .centered .flex {
      flex-direction: column;
      align-items: center;
    }

    .centered .gap-10 {
      gap: 1rem;
    }

    .centered .text-center {
      font-size: 1.5rem;
    }

    .centered .input-container {
      max-width: 100%;
    }

    .centered .input-container input {
      font-size: 1.2rem;
    }

    .centered .input-container .label {
      font-size: 1.2rem;
    }

    .centered .input-container input:focus ~ .label,
    .centered .input-container input:valid ~ .label {
      font-size: 1rem;
    }

    .centered .input-container input:hover {
      border-bottom: 2px solid #555;
    }

    .centered .flex.mb-3.relative.items-center.justify-center {
      margin-top: 1rem;
    }

    .centered .absolute {
      right: 10%;
      top: 30%;
    }

    .h1, p, span, button {
      font-size: 1.5rem;
    }
  }

  @media screen and (min-width: 768px) and (max-width: 899px) {
    .centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background-size: cover !important; /* Ensure background fully covers */
      background-position: center !important;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .md\\:flex-row {
      flex-direction: column !important; /* Remove row layout for tablets */
    }

    .frame-left, .frame-right {
      flex-direction: column !important; /* Stack frames vertically */
    }

    .frame-left {
      margin-left: 2% !important; /* Replace 23% with 2% for tablets */
    }

    .frame-right {
      margin-right: 0 !important;
    }
  }

  @media screen and (min-width: 900px) {
    .centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-left: 0;
      background-size: cover !important;
      background-position: center !important;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .md\\:flex-row {
      flex-direction: row !important; /* Keep row layout for desktop */
    }

    .frame-left {
      margin-left: 5% !important; /* Add left margin for laptops */
    }

    .frame-right {
      margin-right: 0 !important;
    }
  }

  @media screen and (min-width: 768px) and (max-width: 899px) {
    .centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background-size: cover !important; /* Ensure background fully covers */
      background-position: center !important;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .frame-left, .frame-right {
      flex-direction: column !important; /* Stack frames vertically */
    }

    .frame-left {
      margin-left: 0 !important; /* Remove left margin for tablets */
    }

    .frame-right {
      margin-right: 0 !important;
    }
  }

  @media screen and (max-width: 425px) {
    .winning-combinations-title {
      margin-top: 90px; /* Correct margin-top adjustment for smaller screens */
    }
  }
  @media (max-width: 600px) {
  .jackpot-container {
    flex-direction: column;
    text-align: center;
  }
  
@media (max-width: 640px) {
  .mobile-center {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
}


}

`;

export default DisplayHome;
