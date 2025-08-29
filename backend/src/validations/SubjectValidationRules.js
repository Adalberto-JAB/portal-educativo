import { body, param } from 'express-validator';

const subjectValidationRules = {
   create: [
       body('name').notEmpty().withMessage('El nombre de la materia es requerido.').trim(),
       body('subjectArea').notEmpty().withMessage('El área de conocimiento es requerida.').isMongoId().withMessage('ID de área de conocimiento inválido.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de materia inválido.'),
       body('name').optional().notEmpty().withMessage('El nombre de la materia no puede estar vacío.').trim(),
       body('subjectArea').optional().isMongoId().withMessage('ID de área de conocimiento inválido.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de materia inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de materia inválido.')
   ]
};

export default subjectValidationRules;
