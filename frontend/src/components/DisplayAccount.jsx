import React, { useState, useEffect } from "react";
import { Wallet, User, LogOut, CodeSquare, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import fetchAccountData from "../utils/fetchAccountData";
import ButtonWithSound from "./ButtonWithSound";

// import ShowStatusWinning from "./ShowStatusWinning";

const socket = io("http://localhost:3001");

const getToken = () => sessionStorage.getItem("token");
const getUsername = () => sessionStorage.getItem("username") || "Guest";

const DisplayAccount = () => {
  const [accountData, setAccountData] = useState("");
  const [balance, setBalance] = useState(""); // Mock balance
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [popupWithdraw, setPopUpWithdraw] = useState(false);
  const [popupTopUp, setPopUpTopUp] = useState(false);
  const [showWinning, setShowWinning] = useState(null);
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768; 
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024; 
  const isLaptop = window.innerWidth > 1024; 

  useEffect(() => {
    const loadAccountData = async () => {
      const data = await fetchAccountData();

      if (data) {
        setAccountData(data);
      } else {
        setError("Failed to load account data.");
      }
    };

    loadAccountData();
  }, []);

  useEffect(() => {
    socket.on("updateBalance", (newBalance) => {
      setBalance(newBalance);
    });

    return () => {
      socket.off("updateBalance");
    };
  }, []);

  const handleLogout = () => {
    const username = getUsername();

    // Notify server that user is disconnecting
    if (username) {
      socket.emit("userDisconnected", { username });
    }

    // Clear session and redirect to login
    sessionStorage.clear();
    navigate("/sign-in");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const containerStyle = {
    backgroundImage: "url('src/assets/images/bg-account.png')",
    fontFamily: "'Jersey 20', sans-serif",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };

  const logoStyle = {
    backgroundImage: "url('src/assets/images/final-logo.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    top: isMobile ? "10px" : isTablet ? "15px" : "20px",
    left: isMobile ? "5%" : isTablet ? "3%" : "2%",
    width: isMobile ? "100px" : isTablet ? "150px" : "200px",
    height: isMobile ? "100px" : isTablet ? "150px" : "200px",
    position: "absolute",
    zIndex: "10",
  };

  const titleStyle = {
    fontSize: isMobile ? "2rem" : isTablet ? "2.5rem" : "3rem",
    marginTop: isMobile ? "20px" : isTablet ? "30px" : "40px",
  };

  const buttonStyle = {
    width: isMobile ? "150px" : isTablet ? "200px" : "230px",
    fontSize: isMobile ? "1rem" : isTablet ? "1.2rem" : "1.4rem",
  };

  const profileStyle = {
    width: isMobile ? "90%" : isTablet ? "50%" : "30%",
    height: isMobile ? "200px" : isTablet ? "300px" : "400px", 
  };

  const statsStyle = {
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "20px" : isTablet ? "30px" : "50px",
  };

  const buttonGroupStyle = {
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "10px" : isTablet ? "15px" : "20px",
    marginTop: isMobile ? "0" : isTablet ? "80px" : "120px",
  };

  const buttonSpacingStyle = {
    marginTop: isMobile ? "0" : isTablet ? "30px" : "40px",
  };

  return (
    <div
      className="flex flex-col h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={containerStyle}
    >
      <div style={logoStyle}></div>

      <div className="flex justify-center">
        <h1
          style={{ ...titleStyle, fontFamily: "'Jersey 20', sans-serif" }}
          className="mt-10 left-10  text-gray-800 text-center font-bold mb-10  border-blue-500 pb-5 pt-6"
        >
          ACCOUNT INFORMATION
        </h1>
      </div>
      <div
        className="absolute"
        style={{
          top: isMobile ? "50px" : "90px",
          left: isMobile ? "20px" : "50px",
          marginTop: isMobile ? "40px" : "0", 
        }}
      >
        <button
          onClick={() => setShowLogoutPopup(true)}
          className="flex items-center justify-center bg-[#FFCF50] text-white rounded-lg"
          style={{
            width: isMobile ? "200px" : "230px",
            height: isMobile ? "40px" : "50px",
            fontSize: isMobile ? "1rem" : "1.5rem",
            whiteSpace: "nowrap", 
          }}
        >
          RETURN TO MAIN PAGE
        </button>
      </div>
      <div
        className="flex px-6 flex-row w-full h-auto justify-start gap-6 mt-5"
        style={statsStyle}
      >
        {/* PROFILE */}
        <div
          className="flex flex-col h-[600px] w-[20%] bg-[#FBE196] rounded-lg shadow-md items-center justify-center"
          style={{
            ...profileStyle,
            marginLeft: isMobile ? "20px" : "150px", 
          }}
        >
          <div
            className="w-[150px] h-[150px] bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('src/assets/images/account-img.png')",
              backgroundSize: "contain",
              width: isMobile ? "100px" : "150px",
              height: isMobile ? "100px" : "150px",
            }}
          ></div>
          <p
            className="text-black mt-2 text-center text-[2rem]"
            style={{ fontSize: isMobile ? "1.5rem" : "2rem" }}
          >
            user_nemo
          </p>
        </div>

        <div
          className={`flex ${
            isMobile ? "flex-col items-center" : "flex-row"
          } w-[75%] gap-[50px] justify-center mt-5`}
          style={{
            alignItems: isMobile ? "center" : "flex-start", 
            gap: isMobile ? "20px" : "50px", 
          }}
        >


          {/* WALLET BALANCE */}
          <div
            className="flex flex-col h-[120px] w-[38%] items-center justify-center"
            style={{
              width: isMobile ? "90%" : "38%",
              marginLeft: isMobile ? "30%" : "0", 
              marginTop: isMobile ? "50px" : "0",
              alignSelf: isMobile ? "center" : "flex-start", 
            }}
          >
            <div
              className="flex flex-col w-[350px] h-[150px] bg-[#41644A] border-[#FFCF50] border-4 rounded-md shadow-md"
              style={{
                width: isMobile ? "100%" : "350px",
                height: "150px",
                marginTop: isMobile ? "0" : "-0px", 
              }}
            >
              <p className="text-[2rem] pl-[15px] pt-[6px]">WALLET BALANCE</p>
              <p className="text-[3rem] pl-[50px] pt-[5px] pb-[10px]">
                $200.00
              </p>
            </div>

            {/* Buttons below Wallet Balance */}
            <div
              className="flex flex-row gap-4 mt-4"
              style={{
                justifyContent: isMobile ? "center" : "flex-start",
                marginLeft: isMobile ? "0" : isTablet ? "10px" : "20px",
              }}
            >
              <button
                onClick={() => setPopUpWithdraw(true)}
                className="text-[1.5rem] bg-[#D01010] px-4 py-2 w-[150px] h-[50px] rounded-lg text-white"
                style={{
                  marginBottom: isMobile ? "0" : isTablet ? "15px" : "20px",
                }}
              >
                WITHDRAW
              </button>
              <button
                onClick={() => setPopUpTopUp(true)}
                className="text-[1.5rem] bg-[#D01010] px-4 py-2 w-[150px] h-[50px] rounded-lg text-white mb-5 "
              >
                TOP UP
              </button>
            </div>
          </div>
        </div>
        <div
          className="absolute"
          style={{
            bottom: isMobile ? "600px" : "auto",
            right: isMobile ? "10px" : "230px",
            display: isMobile ? "flex" : "block", 
            flexDirection: isMobile ? "column" : "column", 
            gap: isMobile ? "10px" : "20px",
            marginTop: isMobile ? "0" : "150px", 
          }}
        >
          <button
            onClick={handleHistory}
            className="p-0 flex items-center justify-center bg-[#E8AC41] text-white rounded-lg shadow-md transition"
            style={{
              width: isMobile ? "150px" : "250px", 
              height: isMobile ? "40px" : "50px",
              fontSize: isMobile ? "1rem" : "1.5rem",
              marginTop: isMobile ? "0" : "50px",
            }}
          >
            HISTORY
          </button>
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="p-0 flex items-center justify-center bg-[#41644A] text-white rounded-lg shadow-md transition"
            style={{
              width: isMobile ? "150px" : "250px", 
              height: isMobile ? "40px" : "50px",
              fontSize: isMobile ? "1rem" : "1.5rem",
              marginTop: isMobile ? "0" : "20px", 
            }}
          >
            LOG OUT
          </button>
          <button
            onClick={() => setShowWinning("lost")}
            className="p-0 flex items-center justify-center bg-[#D01010] text-white rounded-lg shadow-md transition"
            style={{
              width: isMobile ? "150px" : "250px", 
              height: isMobile ? "40px" : "50px",
              fontSize: isMobile ? "1rem" : "1.5rem",
              marginTop: isMobile ? "0" : "20px", 
            }}
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
      {/* Logout Button
      <ButtonWithSound
        onClick={() => setShowLogoutPopup(true)}
        className="w-[100px] flex items-center justify-center  bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
      >
        <p className="">Logout</p>
      </ButtonWithSound> */}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to exit?
            </h2>
            <div className="flex justify-center gap-4">
              <ButtonWithSound
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition"
              >
                Yes, Logout
              </ButtonWithSound>
              <ButtonWithSound
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-700 transition"
              >
                Cancel
              </ButtonWithSound>
            </div>
          </div>
        </div>
      )}

      {/*WITHDRAW Popup */}
      {popupWithdraw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#FFCF50] p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">ENTER AMOUNT TO WITHDRAW</h2>
            <div className="inset-0">
              <input
                type="email"
                className="w-full p-2 border-b-2 border-black bg-transparent text-2xl text-black mb-3 focus:outline-none"
              />
            </div>
            <div className="flex justify-center gap-4">
              <ButtonWithSound
                onClick={() => setPopUpWithdraw(false)}
                className="bg-[#C14600] px-4 py-2 rounded-lg text-white transition"
              >
                Cancel
              </ButtonWithSound>
              <ButtonWithSound
                onClick={handleLogout}
                className="bg-[#41644A] px-4 py-2 rounded-lg text-white transition"
              >
                WITHDRAW CASH
              </ButtonWithSound>
            </div>
          </div>
        </div>
      )}
      {/*TOP UP Popup */}
      {popupTopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#FFCF50] p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">ENTER AMOUNT TO TOP-UP</h2>
            <div className="">
              <input
                type="email"
                className="w-full p-2 border-b-2 border-black bg-transparent text-2xl text-black mb-3 focus:outline-none"
              />
            </div>
            <div className="flex justify-center gap-4">
              <ButtonWithSound
                onClick={() => setPopUpTopUp(false)}
                className="bg-[#C14600] px-4 py-2 rounded-lg text-white transition"
              >
                Cancel
              </ButtonWithSound>
              <ButtonWithSound
                onClick={handleLogout}
                className="bg-[#41644A] px-4 py-2 rounded-lg text-white transition"
              >
                TOP UP
              </ButtonWithSound>
            </div>
          </div>
        </div>
      )}

      {showWinning === "win" && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="flex flex-col items-center">
            <div
              className="flex flex-row justify-center"
              style={{ marginTop: -40 }}
            >
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="pb-[200px] bg-no-repeat mr-2 bg-contain w-[120px] h-[110px]"
                  style={{
                    backgroundImage: "url('src/assets/images/winning-img.png')",
                    fontFamily: "'Jersey 20', sans-serif",
                  }}
                ></div>
              ))}
            </div>
            <div className=" bg-[#FFCF50] p-20 rounded-lg shadow-lg text-center mb-[100px]">
              <h2 className="text-[50px] font-semibold text-black">YOU WON!</h2>
            </div>
          </div>
        </div>
      )}
      {showWinning === "lost" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#9E9E9E] p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-[50px] font-semibold text-black">YOU LOST!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayAccount;
