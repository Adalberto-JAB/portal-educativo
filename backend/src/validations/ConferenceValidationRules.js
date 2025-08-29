import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const conferenceValidationRules = {
   create: [
       body('title').notEmpty().withMessage('El título de la conferencia es requerido.').trim(),
       body('topic').optional().trim(),
       body('audience').optional().trim(),
       body('type').isIn(['Presencial', 'Virtual']).withMessage('Tipo de conferencia inválido.'),
       body('organizer').optional().trim(),
       body('speakers').optional().isArray().withMessage('Speakers debe ser un array.'),
       body('speakers.*').optional().notEmpty().withMessage('El nombre del ponente no puede estar vacío.').trim(),
       body('startDate').isISO8601().toDate().withMessage('Formato de fecha de inicio inválido.'),
       body('duration').isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo.'),
       body('cost').optional().isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo.'),
       body('isFree').optional().isBoolean().withMessage('isFree debe ser un booleano.'),
       body('cover').optional().isMongoId().withMessage('ID de portada inválido.'),
       body('url').optional().isURL().withMessage('URL inválida.').trim(),
       body('phoneNumber').optional().trim()
   ],
   update: [
       param('id').isMongoId().withMessage('ID de conferencia inválido.'),
       body('title').optional().notEmpty().withMessage('El título de la conferencia no puede estar vacío.').trim(),
       body('topic').optional().trim(),
       body('audience').optional().trim(),
       body('type').optional().isIn(['Presencial', 'Virtual']).withMessage('Tipo de conferencia inválido.'),
       body('organizer').optional().trim(),
       body('speakers').optional().isArray().withMessage('Speakers debe ser un array.'),
       body('speakers.*').optional().notEmpty().withMessage('El nombre del ponente no puede estar vacío.').trim(),
       body('startDate').optional().isISO8601().toDate().withMessage('Formato de fecha de inicio inválido.'),
       body('duration').optional().isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo.'),
       body('cost').optional().isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo.'),
       body('isFree').optional().isBoolean().withMessage('isFree debe ser un booleano.'),
       body('cover').optional().isMongoId().withMessage('ID de portada inválido.'),
       body('url').optional().isURL().withMessage('URL inválida.').trim(),
       body('phoneNumber').optional().trim()
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de conferencia inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de conferencia inválido.')
   ]
};

export default conferenceValidationRules;
