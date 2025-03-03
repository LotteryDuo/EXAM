const socket = io("http://localhost:3000");

socket.emit("join", "3001");

socket.on("countdown", (timeLeft) => {
  console.log(`Received countdown in Room 3000: ${timeLeft}s`);
  document.getElementById("root").innerText = `Countdown: ${timeLeft}s`;
});
