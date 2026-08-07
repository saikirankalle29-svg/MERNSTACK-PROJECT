import express from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getDepartments)
  .post(protect, authorize('Admin'), createDepartment);

router
  .route('/:id')
  .put(protect, authorize('Admin'), updateDepartment)
  .delete(protect, authorize('Admin'), deleteDepartment);

export default router;
