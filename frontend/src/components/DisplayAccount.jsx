import React, { useState, useEffect } from "react";
import { Wallet, User, LogOut, CodeSquare, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import fetchAccountData from "../utils/fetchAccountData";
import ButtonWithSound from "./ButtonWithSound";

const socket = io("http://localhost:3001");

const getToken = () => sessionStorage.getItem("token");
const getUsername = () => sessionStorage.getItem("username") || "Guest";

const DisplayAccount = () => {
  const [accountData, setAccountData] = useState("");
  const [balance, setBalance] = useState(""); // Mock balance
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div
      className="flex flex-col items-center justify-center p-6 h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('src/assets/images/background-image.png')",
      }}
    >
      {/* Back Button */}
      <ButtonWithSound
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </ButtonWithSound>

      {/* User Info */}
      <div className="bg-gray-800 p-6 mt-4 rounded-xl shadow-lg w-full max-w-md text-center">
        <User className="w-12 h-12 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-2">
          {accountData.fullname === "" ? getUsername() : accountData.fullname}
        </h2>
        <p className="text-gray-400">Account Information</p>
      </div>

      {/* Balance Info */}
      <div className="bg-gray-800 p-6 mt-4 rounded-xl shadow-lg w-full max-w-md text-center">
        <Wallet className="w-12 h-12 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold mt-2">₱{accountData.balance}</h2>
        <p className="text-gray-400">Current Balance</p>
      </div>

      {/* Logout Button */}
      <ButtonWithSound
        onClick={() => setShowLogoutPopup(true)}
        className="mt-6 flex items-center gap-2 bg-red-600 px-6 py-3 text-white rounded-lg shadow-md hover:bg-red-700 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </ButtonWithSound>

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
    </div>
  );
};

export default DisplayAccount;
