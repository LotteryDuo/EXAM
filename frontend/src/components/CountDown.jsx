import React from "react";
import { useState, useEffect } from "react";
import Alert from "./Alert";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState(60); // Start at 60 seconds

  useEffect(() => {
    socket.emit("join", "3001");

    socket.on("countdown", (timeLeft) => {
      console.log(`Received countdown in Room 3001: ${timeLeft}s`);
      setTimeLeft(timeLeft);
    });

    return () => {
      socket.off("countdown");
    };
  }, []); // Add empty dependency array

  return (
    <div
      style={{
        fontFamily: "'Jersey 20', sans-serif",
        backgroundColor: "#41644A",
      }}
      className="absolute top-10 right-4 text-white text-2xl px-6 py-2 rounded-lg"
    >
      NEXT DRAW IN: {timeLeft}s
    </div>
  );
};

export default CountDown;
