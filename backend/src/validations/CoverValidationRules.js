import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const coverValidationRules = {
   create: [
       body('name').notEmpty().withMessage('El nombre de la portada es requerido.').trim(),
       body('isGeneric').optional().isBoolean().withMessage('isGeneric debe ser un booleano.'),
       body('idUser').optional().custom((value, { req }) => {
           if (!req.body.isGeneric && !value) {
               throw new Error('Para portadas no genéricas, se requiere un ID de usuario.');
           }
           if (value && !mongoose.Types.ObjectId.isValid(value)) {
               throw new Error('ID de usuario inválido.');
           }
           return true;
       })
   ],
   update: [
       param('id').isMongoId().withMessage('ID de portada inválido.'),
       body('name').optional().notEmpty().withMessage('El nombre de la portada no puede estar vacío.').trim(),
       body('isGeneric').optional().isBoolean().withMessage('isGeneric debe ser un booleano.'),
       body('idUser').optional().custom((value, { req }) => {
           if (req.body.isGeneric === false && !value) { // Si se está haciendo no genérica y no hay idUser
               throw new Error('Para portadas no genéricas, se requiere un ID de usuario.');
           }
           if (value && !mongoose.Types.ObjectId.isValid(value)) {
               throw new Error('ID de usuario inválido.');
           }
           return true;
       })
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de portada inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de portada inválido.')
   ]
};

export default coverValidationRules;
