import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

const enrollmentValidationRules = {
   create: [
       body('user').isMongoId().withMessage('ID de usuario inválido.'),
       body('course').isMongoId().withMessage('ID de curso inválido.')
   ],
   getEnrollments: [
       query('userId').optional().isMongoId().withMessage('ID de usuario inválido en el query.'),
       query('courseId').optional().isMongoId().withMessage('ID de curso inválido en el query.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de inscripción inválido.'),
       body('completedLessons').optional().isArray().withMessage('completedLessons debe ser un array.'),
       body('completedLessons.*').optional().isMongoId().withMessage('Los IDs de lección en completedLessons son inválidos.'),
       body('status').optional().isIn(['in_progress', 'completed', 'dropped']).withMessage('Estado de inscripción inválido.'),
       body('completionDate').optional().isISO8601().toDate().withMessage('Formato de fecha de finalización inválido.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de inscripción inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de inscripción inválido.')
   ]
};

export default enrollmentValidationRules;
