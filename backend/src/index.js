import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config.js";

import v1 from "./routes/v1/index.js";
import "./core/database.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/v1", cors(), v1);

let countdownRunning = false;
let timeLeft = 60;
let isFinished = "Countdown finished";

function startCountdown() {
  if (!countdownRunning) {
    countdownRunning = true;

    const countdownInterval = setInterval(() => {
      if (timeLeft > 0) {
        io.emit("countdown", timeLeft); // ✅ Send the same time to ALL clients
        console.log(`Emitting countdown: ${timeLeft}`);
        timeLeft--;
        countdownRunning = true;
      } else {
        io.emit("countdown", isFinished); // ✅ Send the same message to ALL clients
        timeLeft = 60; // Restart countdown
        startCountdown();
      }
    }, 1000);
  }
}

const onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  startCountdown();

  // Immediately send the current countdown value to new clients
  socket.emit("countdown", timeLeft);

  socket.on("join", (room) => {
    if (!onlineUsers.includes(room)) {
      onlineUsers.push(room);
    }
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);

    // Ensure the client receives the current countdown value
    io.to(room).emit("countdown", timeLeft);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
