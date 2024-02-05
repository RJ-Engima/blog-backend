// controllers/commentController.js
import Comment from '../models/comment.model';
import logger from '../config/logger';

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    logger.error(`Error getting comments: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


