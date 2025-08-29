import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

const commentValidationRules = {
   create: [
       body('text').notEmpty().withMessage('El texto del comentario es requerido.').trim(),
       body('author').isMongoId().withMessage('ID de autor inválido.'),
       body('forumPost').isMongoId().withMessage('ID de post de foro inválido.')
   ],
   getComments: [
       query('forumPostId').optional().isMongoId().withMessage('ID de post de foro inválido en el query.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de comentario inválido.'),
       body('text').optional().notEmpty().withMessage('El texto del comentario no puede estar vacío.').trim(),
       body('isApproved').optional().isBoolean().withMessage('isApproved debe ser un booleano.')
   ],
   approve: [
       param('id').isMongoId().withMessage('ID de comentario inválido.'),
       body('isApproved').isBoolean().withMessage('isApproved debe ser un booleano.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de comentario inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de comentario inválido.')
   ]
};

export default commentValidationRules;
