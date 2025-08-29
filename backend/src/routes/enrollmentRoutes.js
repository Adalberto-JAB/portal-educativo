import express from 'express';
import {
   createEnrollment,
   getEnrollments,
   getEnrollmentById,
   updateEnrollment,
   deleteEnrollment,
   checkEnrollmentStatus
} from '../controllers/enrollmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import enrollmentValidationRules from '../validations/EnrollmentValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, enrollmentValidationRules.create, createEnrollment) // Cualquier usuario autenticado puede inscribirse
   .get(protect, enrollmentValidationRules.getEnrollments, getEnrollments); // Admin, Teacher o el propio usuario

router.route('/status/:courseId')
    .get(protect, checkEnrollmentStatus);

router.route('/:id')
   .get(protect, enrollmentValidationRules.getById, getEnrollmentById) // Admin, Teacher o el propio usuario
   .put(protect, enrollmentValidationRules.update, updateEnrollment) // Admin, Teacher o el propio usuario
   .delete(protect, authorizeRoles('admin', 'teacher'), enrollmentValidationRules.delete, deleteEnrollment); // Solo admin/teacher pueden eliminar inscripciones

export default router;
