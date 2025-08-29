import express from 'express';
import * as subjectAreaController from '../controllers/subjectAreaController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { subjectAreaValidationRules } from '../validations/SubjectAreaValidationRules.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();
const adminOnly = authorizeRoles('admin');

router.route('/')
  .get(protect, adminOnly, subjectAreaController.getAllSubjectAreas)
  .post(protect, adminOnly, subjectAreaValidationRules(), validate, subjectAreaController.createSubjectArea);

router.route('/:id')
  .get(protect, adminOnly, subjectAreaController.getSubjectAreaById)
  .put(protect, adminOnly, subjectAreaValidationRules(), validate, subjectAreaController.updateSubjectArea)
  .delete(protect, adminOnly, subjectAreaController.deleteSubjectArea);

export default router;
