import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const courseValidationRules = {
   create: [
       body('title').notEmpty().withMessage('El título del curso es requerido.').trim(),
       body('description').optional().trim(),
       body('author').isMongoId().withMessage('ID de autor inválido.'),
       body('subject').isMongoId().withMessage('ID de materia inválido.'),
       body('nivel').isMongoId().withMessage('ID de nivel inválido.'),
       body('cover').optional().isMongoId().withMessage('ID de portada inválido.'),
       body('isPublished').optional().isBoolean().withMessage('isPublished debe ser un booleano.'),
       body('isGuestViewable').optional().isBoolean().withMessage('isGuestViewable debe ser un booleano.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de curso inválido.'),
       body('title').optional().notEmpty().withMessage('El título del curso no puede estar vacío.').trim(),
       body('description').optional().trim(),
       body('author').optional().isMongoId().withMessage('ID de autor inválido.'),
       body('subject').optional().isMongoId().withMessage('ID de materia inválido.'),
       body('nivel').optional().isMongoId().withMessage('ID de nivel inválido.'),
       body('cover').optional().isMongoId().withMessage('ID de portada inválido.'),
       body('isPublished').optional().isBoolean().withMessage('isPublished debe ser un booleano.'),
       body('isGuestViewable').optional().isBoolean().withMessage('isGuestViewable debe ser un booleano.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de curso inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de curso inválido.')
   ]
};

export default courseValidationRules;
