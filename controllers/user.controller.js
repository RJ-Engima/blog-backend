// controllers/postController.js
import Users from '../models/user.model.js';
import logger from '../config/logger.js';

const getAllUsers = async (req, res) => {
  try {
    const posts = await Users.find();
    res.json(posts);
  } catch (error) {
    logger.error(`Error getting posts: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getAllUsers };
