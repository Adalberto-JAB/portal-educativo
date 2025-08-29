import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import EnrollmentService from '../services/EnrollmentService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear una nueva inscripción
// @route   POST /api/enrollments
// @access  Private (Authenticated users)
const createEnrollment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const enrollment = await EnrollmentService.createEnrollment(req.body);
   res.status(201).json(enrollment);
});

// @desc    Obtener todas las inscripciones (filtrado por usuario o curso)
// @route   GET /api/enrollments
// @route   GET /api/enrollments?userId=...
// @route   GET /api/enrollments?courseId=...
// @access  Private/Admin, Teacher o el propio usuario
const getEnrollments = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación para query params

   const enrollments = await EnrollmentService.getEnrollments(req.query, req.user); // Pasar filtros y req.user
   res.json(enrollments);
});

// @desc    Obtener inscripción por ID
// @route   GET /api/enrollments/:id
// @access  Private/Admin, Teacher o el propio usuario
const getEnrollmentById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const enrollment = await EnrollmentService.getEnrollmentById(req.params.id, req.user); // Pasar req.user
   res.json(enrollment);
});

// @desc    Actualizar inscripción (ej. marcar lecciones completadas, cambiar estado)
// @route   PUT /api/enrollments/:id
// @access  Private/Admin, Teacher o el propio usuario
const updateEnrollment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedEnrollment = await EnrollmentService.updateEnrollment(req.params.id, req.body, req.user); // Pasar req.user
   res.json(updatedEnrollment);
});

// @desc    Eliminar inscripción
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin, Teacher
const deleteEnrollment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await EnrollmentService.deleteEnrollment(req.params.id);
   res.json(message);
});

// @desc    Verificar si el usuario está inscrito en un curso
// @route   GET /api/enrollments/status/:courseId
// @access  Private
const checkEnrollmentStatus = asyncHandler(async (req, res) => {
   const { courseId } = req.params;
   const userId = req.user._id;

   const status = await EnrollmentService.getEnrollmentStatus(userId, courseId);
   res.json(status);
});

export {
   createEnrollment,
   getEnrollments,
   getEnrollmentById,
   updateEnrollment,
   deleteEnrollment,
   checkEnrollmentStatus
};
