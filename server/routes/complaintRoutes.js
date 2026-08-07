import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addCitizenFeedback,
  deleteComplaint
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('Citizen', 'Admin'), upload.single('image'), createComplaint)
  .get(protect, getComplaints);

router
  .route('/:id')
  .get(protect, getComplaintById)
  .put(protect, authorize('Department Officer', 'Admin'), upload.single('resolutionImage'), updateComplaintStatus)
  .delete(protect, authorize('Admin'), deleteComplaint);

router.post('/:id/feedback', protect, authorize('Citizen'), addCitizenFeedback);

export default router;
