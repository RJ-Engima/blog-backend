import express from 'express';
import { getAnalytics, getAnalyticsLocation, getAnalyticsTrending } from'../controllers/analytics.controller.js';

const router = express.Router();

// Define your routes for posts

router.get('/views', getAnalytics);
router.get('/trending', getAnalyticsTrending);
router.get('/location', getAnalyticsLocation);

export default router;
