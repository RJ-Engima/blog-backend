import express from 'express';
import { importData } from'../controllers/import.controller.js';

const router = express.Router();

router.post('/', importData);

export default router;
