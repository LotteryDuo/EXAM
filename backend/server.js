import { io } from "socket.io-client"; // ✅ Correct import

const socket = io("http://localhost:3000");

socket.emit("join", "3001");

socket.on("countdown", (timeLeft) => {
  console.log(`Received countdown in Room 3001: ${timeLeft}s`);
  document.getElementById("root").innerText = timeLeft;
});
