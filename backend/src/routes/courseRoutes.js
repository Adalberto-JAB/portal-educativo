import express from 'express';
import {
   createCourse,
   getCourses,
   getCourseById,
   updateCourse,
   deleteCourse,
   getMyCourses
} from '../controllers/courseController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import courseValidationRules from '../validations/CourseValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin', 'teacher'), courseValidationRules.create, createCourse)
   .get(getCourses); // Cualquiera puede ver los cursos

router.route('/my-courses')
    .get(protect, authorizeRoles('admin', 'teacher'), getMyCourses);

router.route('/:id')
   .get(courseValidationRules.getById, getCourseById) // Cualquiera puede ver un curso por ID
   .put(protect, authorizeRoles('admin', 'teacher'), courseValidationRules.update, updateCourse)
   .delete(protect, authorizeRoles('admin', 'teacher'), courseValidationRules.delete, deleteCourse);

export default router;

