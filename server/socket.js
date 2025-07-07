// server/socket.js

const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      // --- THIS IS THE MODIFIED LINE ---
      // We've updated the port from 5173 to 3001 to match your React app's URL.
      origin: "http://localhost:3001",
      
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ A user connected with socket ID: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected with socket ID: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };