// socketConfig.js
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { userLogin } from "../controllers/user.controller.js";

export function configureSocket(server) {
  const httpServer = createServer(server);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["https://blog-frontend-0lz0.onrender.com", "http://localhost:5173"],
      methods: ["GET", "POST"]
    }
  });
  const onConnection = (socket) => {
    console.log(socket.id);
    socket.emit('welcome', `Welcome to the order notifications`);
    socket.emit('check', 'hashashdsah')
    // userLogin( io, socket )
  }
  io.on("connection", onConnection);
  return httpServer
}
