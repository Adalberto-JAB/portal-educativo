import express from 'express';
import {
   createSubject,
   getSubjects,
   getSubjectById,
   updateSubject,
   deleteSubject
} from '../controllers/subjectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import subjectValidationRules from '../validations/SubjectValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin'), subjectValidationRules.create, createSubject) // Solo admin puede crear materias
   .get(getSubjects); // Cualquiera puede obtener materias

router.route('/:id')
   .get(subjectValidationRules.getById, getSubjectById) // Cualquiera puede obtener una materia por ID
   .put(protect, authorizeRoles('admin'), subjectValidationRules.update, updateSubject) // Solo admin puede actualizar materias
   .delete(protect, authorizeRoles('admin'), subjectValidationRules.delete, deleteSubject); // Solo admin puede eliminar materias

export default router;
