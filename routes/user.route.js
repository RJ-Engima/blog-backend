import express from 'express';
import { getAllUsers } from'../controllers/user.controller.js';

const router = express.Router();

// Define your routes for users
router.get('/', getAllUsers);
// router.get('/:userId', userController.getUserById);
// router.post('/', userController.createUser);
// Add more routes as needed

export default router;
