import express from 'express';
import { getAdminStats, getUsers, updateUserRole } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);

export default router;
