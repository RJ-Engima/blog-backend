import Comment from '../models/comment.model.js';
import logger from '../config/logger.js';

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    logger.error(`Error getting comments: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


