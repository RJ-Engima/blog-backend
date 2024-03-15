// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import logger from "./config/logger.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import importRoutes from "./routes/import.route.js";
import commentRoutes from "./routes/comment.route.js";
import dotenv from "dotenv";
import { customMiddleware } from "./config/middleware.js";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";


dotenv.config({ path: path.resolve(process.cwd(), `${process.env.NODE_ENV}.env`) });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["https://blog-frontend-0lz0.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log('A user is connected');

  socket.on('message', (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  })

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
  })
})
export {io};
// Middleware
const corsOptions = {
  origin: ["https://blog-frontend-0lz0.onrender.com", "http://localhost:5173"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: false }));
app.use(customMiddleware);

// Start the server
const NODE_ENV = process.env.NODE_ENV;

// Use configureSocket function to configure Socket.IO

httpServer.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      logger.warn(`${NODE_ENV.toLocaleUpperCase()}-Database connection Successful`);
    })
    .catch((error) => {
      logger.error(error);
      logger.error(`${NODE_ENV.toLocaleUpperCase()}-Database connection unsuccessful`);
    });
});
// socketEmit('login', "helloooo");

// Routes
app.use("/api/post", postRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/import", importRoutes);
app.set('trust proxy', 1);
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.apiError("Internal Server Error", 500);
});
