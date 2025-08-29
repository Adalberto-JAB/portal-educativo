import express from 'express';
import {
    createAsignatura,
    getAllAsignaturas,
    getAsignaturaById,
    updateAsignatura,
    deleteAsignatura,
    getAsignaturasByCarrera
} from '../controllers/asignaturaController.js';
import {
    createAsignaturaValidationRules,
    updateAsignaturaValidationRules
} from '../validations/AsignaturaValidationRules.js';
import { validate } from '../middleware/validationMiddleware.js'; // Assuming you have a validation middleware
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

// Protect all routes and authorize admin for CUD operations
router.route('/')
    .post(protect, authorizeRoles('admin'), createAsignaturaValidationRules, validate, createAsignatura)
    .get(protect, getAllAsignaturas); // Anyone authenticated can get all

router.route('/:id')
    .get(protect, getAsignaturaById)
    .put(protect, authorizeRoles('admin'), updateAsignaturaValidationRules, validate, updateAsignatura)
    .delete(protect, authorizeRoles('admin'), deleteAsignatura);

router.route('/carrera/:carreraId')
    .get(protect, getAsignaturasByCarrera);

export default router;
