import express from 'express';
import {
   createLesson,
   getLessons,
   getLessonById,
   updateLesson,
   deleteLesson,
   getLessonPdf // <-- Added
} from '../controllers/lessonController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { pdfUpload } from '../config/multerConfig.js'; // <-- Changed
import lessonValidationRules from '../validations/LessonValidationRules.js';

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin', 'teacher'), pdfUpload.single('pdfFile'), lessonValidationRules.create, createLesson) // <-- Changed
   .get(lessonValidationRules.getLessons, getLessons);

router.route('/:id')
   .get(lessonValidationRules.getById, getLessonById)
   .put(protect, authorizeRoles('admin', 'teacher'), pdfUpload.single('pdfFile'), lessonValidationRules.update, updateLesson) // <-- Changed
   .delete(protect, authorizeRoles('admin', 'teacher'), lessonValidationRules.delete, deleteLesson);

router.route('/:id/pdf') // <-- New route for PDF download
   .get(lessonValidationRules.getById, getLessonPdf);

export default router;
