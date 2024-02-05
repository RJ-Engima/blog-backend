import express from 'express';
import { importData } from'../controllers/imoprt.controller.js';

const router = express.Router();

router.post('/', importData);

export default router;
