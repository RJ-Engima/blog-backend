import express from 'express';
import {getAllPosts} from'../controllers/post.controller.js';

const router = express.Router();

// Define your routes for posts
router.get('/', getAllPosts);
// router.get('/trending', postController.getTrendingPosts);  // New route for trending posts
// router.get('/:postId', postController.getPostById);
// router.post('/', postController.createPost);
// Add more routes as needed

export default router;
