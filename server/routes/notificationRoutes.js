import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserNotifications);
router.put('/:id/read', markNotificationAsRead);

export default router;
