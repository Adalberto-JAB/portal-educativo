import { body, param } from 'express-validator';

const nivelValidationRules = {
   create: [
       body('name').notEmpty().withMessage('El nombre del nivel es requerido.').trim(),
       body('description').optional().trim()
   ],
   update: [
       param('id').isMongoId().withMessage('ID de nivel inválido.'),
       body('name').optional().notEmpty().withMessage('El nombre del nivel no puede estar vacío.').trim(),
       body('description').optional().trim()
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de nivel inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de nivel inválido.')
   ]
};

export default nivelValidationRules;
