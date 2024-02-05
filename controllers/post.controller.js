// controllers/postController.js
import Post from '../models/post.model.js';
import logger from '../config/logger.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $inc: { views: 1 },
        $set: { trendingScore: calculateTrendingScore(post) },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getTrendingPosts = async (req, res) => {
  try {
    const trendingPosts = await Post.find()
      .sort('-trendingScore')  // Sort by trending score in descending order
      .limit(5);               // Retrieve the top 5 trending posts

    res.json(trendingPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
