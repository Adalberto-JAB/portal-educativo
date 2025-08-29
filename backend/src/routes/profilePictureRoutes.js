import express from 'express';
import {
   createProfilePicture,
   getProfilePictureById,
   updateProfilePicture,
   deleteProfilePicture
} from '../controllers/profilePictureController.js';
import { protect } from '../middleware/authMiddleware.js';
import { imageUpload } from '../config/multerConfig.js'; // Importar la configuración de Multer
import profilePictureValidationRules from '../validations/ProfilePictureValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, imageUpload.single('image'), profilePictureValidationRules.create, createProfilePicture); // Cualquier usuario autenticado puede subir una imagen

router.route('/:id')
   .get(profilePictureValidationRules.getById, getProfilePictureById) // Cualquiera puede obtener una imagen de perfil por ID (el controlador envía el buffer)
   .put(protect, imageUpload.single('image'), profilePictureValidationRules.update, updateProfilePicture) // Usuario autenticado o admin
   .delete(protect, deleteProfilePicture); // Usuario autenticado o admin

export default router;
