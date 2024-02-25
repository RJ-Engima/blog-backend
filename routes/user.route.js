import express from 'express';
import { addUser, getAllUsers, userLogin } from'../controllers/user.controller.js';

const router = express.Router();

// Define your routes for users
router.post('/add', addUser);
router.post('/login', userLogin);
router.get('/', getAllUsers);

export default router;
