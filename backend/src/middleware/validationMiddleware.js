import { body, validationResult } from 'express-validator';

// Reglas de validación para crear/actualizar documentación
export const documentationValidationRules = () => [
    body('title')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    body('fileType')
        .notEmpty().withMessage('El tipo de archivo es obligatorio')
        .isIn(['Imagen', 'PDF', 'Video']).withMessage('Tipo de archivo inválido'),
    body('subject')
        .notEmpty().withMessage('La materia es obligatoria'),
    body('asignatura')
        .notEmpty().withMessage('La asignatura es obligatoria'),
    body('nivel')
        .notEmpty().withMessage('El nivel es obligatorio')
];

// Middleware para manejar los errores de validación
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};