import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState("00");
  const [fontSize, setFontSize] = useState("1.9rem");
  const [marginBottom, setMarginBottom] = useState("5%");

  useEffect(() => {
    socket.emit("join", "3001");

    socket.on("countdown", (timeLeft) => {
      console.log(`Received countdown in Room 3001: ${timeLeft}s`);
      setTimeLeft(timeLeft);
    });

    return () => {
      socket.off("countdown");
    };
  }, []);

  useEffect(() => {
    const updateFontSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setFontSize("1.2rem");
        setMarginBottom("3%");
        // Mobile
      } else if (screenWidth < 900) {
        setFontSize("1.5rem");
        setMarginBottom("4%");
        // Tablet
      } else {
        setFontSize("1.9rem");
        setMarginBottom("5%");
        // Desktop
      }
    };

    window.addEventListener("resize", updateFontSize);
    updateFontSize(); 

    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);

  const countdownStyle = {
    fontFamily: "'Jersey 20', sans-serif",
    backgroundColor: "#E8AC41",
    fontSize: fontSize,
    marginTop: window.innerWidth <= 600 ? "27%" : "3%", // Apply mt-[27%] for mobile only
  };

  return (
    <div
      style={countdownStyle}
      className="absolute right-0 text-white mr-5 px-6 py-1 rounded-lg"
    >
      NEXT DRAW IN: {timeLeft}s
    </div>
  );
};

export default CountDown;
