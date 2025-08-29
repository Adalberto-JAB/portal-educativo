import { body, param } from 'express-validator';

const facultadValidationRules = {
   create: [
       body('name').notEmpty().withMessage('El nombre de la facultad es requerido.').trim(),
       body('description').optional().trim()
   ],
   update: [
       param('id').isMongoId().withMessage('ID de facultad inválido.'),
       body('name').optional().notEmpty().withMessage('El nombre de la facultad no puede estar vacío.').trim(),
       body('description').optional().trim()
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de facultad inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de facultad inválido.')
   ]
};

export default facultadValidationRules;
