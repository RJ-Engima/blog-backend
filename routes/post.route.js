import express from 'express';
import { addPost, getAllCategory, getAllPosts,getPost, getPostAuthor, getPostCategory, getTrendingPosts } from'../controllers/post.controller.js';
import { authenticate } from'../config/auth.js';
const router = express.Router();

// Define your routes for posts

// router.get('/', getAllPosts);
router.get('/', getPost);
router.get('/category', getPostCategory);
router.get('/author', getPostAuthor);
router.get('/category/all', getAllCategory);
router.get('/trending', getTrendingPosts);
router.post('/add', authenticate, addPost);

export default router;
