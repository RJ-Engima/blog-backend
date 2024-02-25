import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import logger from "./config/logger.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import imoprtRoutes from "./routes/import.route.js";
import commentRoutes from "./routes/coment.route.js";
import dotenv from "dotenv";
import { customMiddleware } from "./config/middleware.js";
import serverless from "serverless-http";
import path from "path";
import cors from 'cors'
import { fileURLToPath } from "url";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import cron from 'node-cron'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const analyticsDataClient = new BetaAnalyticsDataClient();
const app = express();
dotenv.config();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET", "POST"]
}
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: false }));
app.use(customMiddleware);
// Routes
app.use("/api/post", postRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/import", imoprtRoutes);
app.set('trust proxy', 1)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.apiError("Internal Server Error", 500);
});

// cron.schedule('* * * * *', () => {
//   logger.info('running every minute 1, 2, 4 and 5');
// });

// Start the server
app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      logger.warn("DEV-Database connection Successfull");
    })
    .catch((error) => {
      logger.error(error);
      logger.error("DEV-Database connection unsuccessfull");
    });
});


export const handler = serverless(app);
