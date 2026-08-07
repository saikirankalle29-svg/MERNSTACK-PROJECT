import express from 'express';
import { analyzeComplaint } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyzeComplaint', analyzeComplaint);

export default router;
