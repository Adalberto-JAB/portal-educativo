import { body } from 'express-validator';

export const subjectAreaValidationRules = () => [
  body('name').notEmpty().withMessage('El nombre es obligatorio.'),
];