import express from 'express';
import {
   createNivel,
   getNiveles,
   getNivelById,
   updateNivel,
   deleteNivel
} from '../controllers/nivelController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import nivelValidationRules from '../validations/NivelValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin'), nivelValidationRules.create, createNivel) // Solo admin puede crear niveles
   .get(getNiveles); // Cualquiera puede obtener niveles

router.route('/:id')
   .get(nivelValidationRules.getById, getNivelById) // Cualquiera puede obtener un nivel por ID
   .put(protect, authorizeRoles('admin'), nivelValidationRules.update, updateNivel) // Solo admin puede actualizar niveles
   .delete(protect, authorizeRoles('admin'), nivelValidationRules.delete, deleteNivel); // Solo admin puede eliminar niveles

export default router;
