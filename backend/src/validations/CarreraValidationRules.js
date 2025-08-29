import { body, param } from 'express-validator';

const carreraValidationRules = {
   create: [
       body('name').notEmpty().withMessage('El nombre de la carrera es requerido.').trim(),
       body('description').optional().trim(),
       body('facultad').notEmpty().withMessage('La facultad es requerida.').isMongoId().withMessage('ID de facultad inválido.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de carrera inválido.'),
       body('name').optional().notEmpty().withMessage('El nombre de la carrera no puede estar vacío.').trim(),
       body('description').optional().trim(),
       body('facultad').optional().notEmpty().withMessage('La facultad no puede estar vacía.').isMongoId().withMessage('ID de facultad inválido.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de carrera inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de carrera inválido.')
   ]
};

export default carreraValidationRules;
