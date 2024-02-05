import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import logger from './config/logger.js';
import postRoutes from './routes/post.route.js';
import userRoutes from './routes/user.route.js';
import imoprtRoutes from './routes/import.route.js';
import commentRoutes from './routes/coment.route.js';
import dotenv from 'dotenv'
import { customMiddleware } from './config/middleware.js';
import serverless from "serverless-http";

const app = express();
dotenv.config()
// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(customMiddleware);
// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/import', imoprtRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.apiError('Internal Server Error', 500);
});

// Start the server
app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
    try {
        mongoose.connect(config.databaseURL);
        logger.warn("DEV-Database connection Successfull")
    } catch (error) {
        logger.error('DEV-Database connection unsuccessfull')
        handleError(error);
    }
});

export const handler = serverless(app);