import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

const lessonValidationRules = {
   create: [
       body('title').notEmpty().withMessage('El título de la lección es requerido.').trim(),
       body('description').optional().trim(),
       body('course').isMongoId().withMessage('ID de curso inválido.'),
       body('order').isInt({ min: 0 }).withMessage('El orden debe ser un número entero no negativo.'),
       body('uploadedBy').isMongoId().withMessage('ID de usuario que subió la lección inválido.')
   ],
   getLessons: [
       query('courseId').optional().isMongoId().withMessage('ID de curso inválido en el query.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de lección inválido.'),
       body('title').optional().notEmpty().withMessage('El título de la lección no puede estar vacío.').trim(),
       body('description').optional().trim(),
       body('course').optional().isMongoId().withMessage('ID de curso inválido.'),
       body('order').optional().isInt({ min: 0 }).withMessage('El orden debe ser un número entero no negativo.'),
       body('uploadedBy').optional().isMongoId().withMessage('ID de usuario que subió la lección inválido.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de lección inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de lección inválido.')
   ]
};

export default lessonValidationRules;
