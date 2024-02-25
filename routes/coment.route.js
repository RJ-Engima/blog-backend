import express from 'express';
import { getAllComments } from'../controllers/comment.controller.js';

const router = express.Router();


// Define your routes for comments
router.get('/', getAllComments);

export default router;
