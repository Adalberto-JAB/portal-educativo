import { body } from 'express-validator';

const mongoIdValidator = (fieldName) => 
    body(fieldName).notEmpty().withMessage(`${fieldName} es requerido.`).isMongoId().withMessage(`${fieldName} debe ser un ID de MongoDB válido.`);

export const documentationValidationRules = () => [
    body('title').notEmpty().withMessage('El título es requerido.').trim(),
    body('description').notEmpty().withMessage('La descripción es requerida.').trim(),
    body('fileType').isIn(['Imagen', 'PDF', 'Video']).withMessage('Tipo de archivo inválido.'),
    // uploadedBy will be set from the authenticated user, so no need to validate from body
    body('isPublished').optional().isBoolean().withMessage('isPublished debe ser un valor booleano.'),
    body('isGuestViewable').optional().isBoolean().withMessage('isGuestViewable debe ser un valor booleano.'),
    mongoIdValidator('subject'),
    mongoIdValidator('asignatura'),
    mongoIdValidator('nivel'),
    body('cover').optional().isMongoId().withMessage('Cover debe ser un ID de MongoDB válido.')
];