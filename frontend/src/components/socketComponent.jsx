import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// const socket = io("http://localhost:4000"); // Connect to WebSocket server

export default function SocketComponent() {
  const [bet, setBet] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for bet events
    socket.on("bet", (data) => {
      setMessages((prev) => [...prev, data]); // Append new bet data
    });

    return () => {
      socket.off("bet"); // Cleanup on unmount
    };
  }, []);

  const handleBet = () => {
    if (bet.trim()) {
      socket.emit("bet", bet); // Send bet to the server
      setBet("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-blue-500">Live Betting</h1>
      <input
        type="text"
        placeholder="Enter bet..."
        value={bet}
        onChange={(e) => setBet(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
      <button
        onClick={handleBet}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
      >
        Place Bet
      </button>
      <div className="mt-4 w-80 p-2 bg-white shadow rounded">
        <h2 className="text-lg font-bold">Recent Bets:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="text-gray-800">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
