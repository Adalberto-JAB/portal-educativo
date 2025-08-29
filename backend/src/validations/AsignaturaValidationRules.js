import { body } from 'express-validator';

const createAsignaturaValidationRules = [
    body('name')
        .notEmpty().withMessage('El nombre de la asignatura es requerido.')
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .trim(),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .trim(),
    body('carrera')
        .notEmpty().withMessage('La carrera es requerida.')
        .isMongoId().withMessage('ID de carrera inválido.')
];

const updateAsignaturaValidationRules = [
    body('name')
        .optional()
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .trim(),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .trim(),
    body('carrera')
        .optional()
        .isMongoId().withMessage('ID de carrera inválido.')
];

export {
    createAsignaturaValidationRules,
    updateAsignaturaValidationRules
};
