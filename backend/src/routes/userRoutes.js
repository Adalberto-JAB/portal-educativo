import express from 'express';
import {
   getUsers,
   getUserById,
   updateUser,
   deleteUser,
   getMe,
   changePassword
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import userValidationRules from '../validations/UserValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .get(protect, authorizeRoles('admin'), getUsers); // Solo admin puede obtener todos los usuarios

router.get('/me', protect, getMe); // Obtener perfil del usuario autenticado

router.put('/change-password', protect, userValidationRules.changePassword, changePassword);

router.route('/:id')
   .get(protect, userValidationRules.getById, getUserById) // Admin o el propio usuario
   .put(protect, userValidationRules.update, updateUser) // Admin o el propio usuario
   .delete(protect, authorizeRoles('admin'), userValidationRules.delete, deleteUser); // Solo admin puede eliminar usuarios

export default router;
