import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const profilePictureValidationRules = {
   create: [
       body('uploadedBy').isMongoId().withMessage('ID de usuario inválido.'),
       body('isDefault').optional().isBoolean().withMessage('isDefault debe ser un booleano.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de imagen de perfil inválido.'),
       body('isDefault').optional().isBoolean().withMessage('isDefault debe ser un booleano.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de imagen de perfil inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de imagen de perfil inválido.')
   ]
};

export default profilePictureValidationRules;
