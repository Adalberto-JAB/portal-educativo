import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import SubjectService from '../services/SubjectService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear una nueva materia
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const subject = await SubjectService.createSubject(req.body);
   res.status(201).json(subject);
});

// @desc    Obtener todas las materias
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
   const subjects = await SubjectService.getSubjects();
   res.json(subjects);
});

// @desc    Obtener materia por ID
// @route   GET /api/subjects/:id
// @access  Public
const getSubjectById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const subject = await SubjectService.getSubjectById(req.params.id);
   res.json(subject);
});

// @desc    Actualizar materia
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedSubject = await SubjectService.updateSubject(req.params.id, req.body);
   res.json(updatedSubject);
});

// @desc    Eliminar materia
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await SubjectService.deleteSubject(req.params.id);
   res.json(message);
});

export {
   createSubject,
   getSubjects,
   getSubjectById,
   updateSubject,
   deleteSubject
};
