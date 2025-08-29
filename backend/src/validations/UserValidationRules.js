import { body, param } from 'express-validator';

const userValidationRules = {
   register: [
       body('name').notEmpty().withMessage('El nombre es requerido.').trim(),
       body('last_name').notEmpty().withMessage('El apellido es requerido.').trim(),
       body('email').isEmail().withMessage('Por favor, ingresa un email válido.').normalizeEmail(),
       body('password')
           .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
           .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
           .withMessage('La contraseña debe contener una mayúscula, minúscula, un número y un carácter especial.'),
       body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Rol inválido.'),
       body('address').optional().trim(),
       body('phoneNumber').optional().trim(),
       body('profilePictureURL').optional().isURL().withMessage('La URL del avatar debe ser válida.')
   ],
   login: [
       body('email').isEmail().withMessage('Por favor, ingresa un email válido.').normalizeEmail(),
       body('password').notEmpty().withMessage('La contraseña es requerida.')
   ],
   update: [
       param('id').isMongoId().withMessage('ID de usuario inválido.'),
       body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío.').trim(),
       body('last_name').optional().notEmpty().withMessage('El apellido no puede estar vacío.').trim(),
       body('email').optional().isEmail().withMessage('Por favor, ingresa un email válido.').normalizeEmail(),
       body('password').optional()
           .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
           .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
           .withMessage('La contraseña debe contener una mayúscula, minúscula, un número y un carácter especial.'),
       body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Rol inválido.'),
       body('address').optional().trim(),
       body('phoneNumber').optional().trim(),
       body('isBlocked').optional().isBoolean().withMessage('isBlocked debe ser un booleano.')
   ],
   getById: [
       param('id').isMongoId().withMessage('ID de usuario inválido.')
   ],
   delete: [
       param('id').isMongoId().withMessage('ID de usuario inválido.')
   ],
   changePassword: [
       body('currentPassword').notEmpty().withMessage('La contraseña actual es requerida.'),
       body('newPassword')
           .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres.')
           .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
           .withMessage('La nueva contraseña debe contener una mayúscula, minúscula, un número y un carácter especial.')
   ]
};

export default userValidationRules;
