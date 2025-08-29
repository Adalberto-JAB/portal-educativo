import express from 'express';
import {
   createCover,
   getCovers,
   getCoverById,
   updateCover,
   deleteCover
} from '../controllers/coverController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { imageUpload } from '../config/multerConfig.js'; // Importar la configuración de Multer
import coverValidationRules from '../validations/CoverValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin', 'teacher'), imageUpload.single('image'), coverValidationRules.create, createCover) // Subida de una sola imagen
   .get(getCovers);

router.route('/:id')
   .get(coverValidationRules.getById, getCoverById) // Obtener la imagen de la portada (el controlador envía el buffer)
   .put(protect, authorizeRoles('admin', 'teacher'), imageUpload.single('image'), coverValidationRules.update, updateCover) // Actualizar con nueva imagen opcional
   .delete(protect, authorizeRoles('admin', 'teacher'), coverValidationRules.delete, deleteCover);

export default router;

