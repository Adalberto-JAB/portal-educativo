import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const forumPostValidationRules = {
   create: [
       body('title').notEmpty().withMessage('El título del post es requerido.').trim(),
       body('content').notEmpty().withMessage('El contenido del post es requerido.').trim(),
       body('subject').isMongoId().withMessage('ID de materia inválido.'),
       body('author').isMongoId().withMessage('ID de autor inválido.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de post de foro inválido.'),
       body('title').optional().notEmpty().withMessage('El título del post no puede estar vacío.').trim(),
       body('content').optional().notEmpty().withMessage('El contenido del post no puede estar vacío.').trim(),
       body('subject').optional().isMongoId().withMessage('ID de materia inválido.'),
       body('isApproved').optional().isBoolean().withMessage('isApproved debe ser un booleano.')
   ],
   approve: [
       param('id').isMongoId().withMessage('ID de post de foro inválido.'),
       body('isApproved').isBoolean().withMessage('isApproved debe ser un booleano.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de post de foro inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de post de foro inválido.')
   ]
};

export default forumPostValidationRules;
