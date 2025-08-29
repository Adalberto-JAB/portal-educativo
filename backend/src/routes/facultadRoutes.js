import express from 'express';
import {
   createFacultad,
   getFacultades,
   getFacultadById,
   updateFacultad,
   deleteFacultad
} from '../controllers/facultadController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import facultadValidationRules from '../validations/FacultadValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin'), facultadValidationRules.create, createFacultad) // Solo admin puede crear facultades
   .get(getFacultades); // Cualquiera puede obtener facultades

router.route('/:id')
   .get(facultadValidationRules.getById, getFacultadById) // Cualquiera puede obtener una facultad por ID
   .put(protect, authorizeRoles('admin'), facultadValidationRules.update, updateFacultad) // Solo admin puede actualizar facultades
   .delete(protect, authorizeRoles('admin'), facultadValidationRules.delete, deleteFacultad); // Solo admin puede eliminar facultades

export default router;
