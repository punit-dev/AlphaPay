const { Server } = require("socket.io");
const UserModel = require("../models/userModel");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket.io connection event
  io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);

    socket.on("add", async (userId) => {
      console.log(userId);

      try {
        await UserModel.findByIdAndUpdate(userId, { socketID: socket.id });
        console.log("User added to socket: ", userId);
      } catch (err) {
        console.error("Error adding user to socket:", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await UserModel.findOneAndUpdate(
          { socketID: socket.id },
          { socketID: null }
        );
        console.log("user disconnected: ", socket.id);
      } catch (err) {
        console.error("Error removing user from socket:", err);
      }
    });
  });
};

const sendData = (socketID, eventName, message) => {
  if (io) {
    io.to(socketID).emit(eventName, message);
  } else {
    console.log("Socket.io is not initialized.");
  }
};

module.exports = { initializeSocket, sendData };
