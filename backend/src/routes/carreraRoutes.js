import express from 'express';
import {
   createCarrera,
   getCarreras,
   getCarreraById,
   updateCarrera,
   deleteCarrera
} from '../controllers/carreraController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import carreraValidationRules from '../validations/CarreraValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin'), carreraValidationRules.create, createCarrera) // Solo admin puede crear carreras
   .get(getCarreras); // Cualquiera puede obtener carreras

router.route('/:id')
   .get(carreraValidationRules.getById, getCarreraById) // Cualquiera puede obtener una carrera por ID
   .put(protect, authorizeRoles('admin'), carreraValidationRules.update, updateCarrera) // Solo admin puede actualizar carreras
   .delete(protect, authorizeRoles('admin'), carreraValidationRules.delete, deleteCarrera); // Solo admin puede eliminar carreras

export default router;
