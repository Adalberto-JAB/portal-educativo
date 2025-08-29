import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import LessonService from '../services/LessonService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear una nueva lección
// @route   POST /api/lessons
// @access  Private/Admin, Teacher
const createLesson = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   if (!req.file) {
       res.status(400);
       throw new Error('El archivo PDF de la lección es requerido.');
   }
   if (req.file.mimetype !== 'application/pdf') {
       res.status(400);
       throw new Error('Solo se permiten archivos PDF.');
   }

   const lesson = await LessonService.createLesson(req.body, req.file, req.user);
   res.status(201).json(lesson);
});

// @desc    Obtener todas las lecciones (opcionalmente por curso)
// @route   GET /api/lessons
// @route   GET /api/lessons?courseId=...
// @access  Public
const getLessons = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación para query params

   const lessons = await LessonService.getLessons(req.query.courseId);
   res.json(lessons);
});

// @desc    Obtener lección por ID
// @route   GET /api/lessons/:id
// @access  Public
const getLessonById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const lesson = await LessonService.getLessonById(req.params.id);
   res.json(lesson);
});

// @desc    Actualizar lección
// @route   PUT /api/lessons/:id
// @access  Private/Admin, Teacher
const updateLesson = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   // Check if a file is provided for update
   if (req.file) {
       if (req.file.mimetype !== 'application/pdf') {
           res.status(400);
           throw new Error('Solo se permiten archivos PDF.');
       }
   }

   const updatedLesson = await LessonService.updateLesson(req.params.id, req.body, req.file, req.user);
   res.json(updatedLesson);
});

// @desc    Eliminar lección
// @route   DELETE /api/lessons/:id
// @access  Private/Admin, Teacher
const deleteLesson = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await LessonService.deleteLesson(req.params.id, req.user);
   res.json(message);
});

// @desc    Obtener el PDF de una lección por ID
// @route   GET /api/lessons/:id/pdf
// @access  Public
const getLessonPdf = asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);

    const { data, contentType, originalName } = await LessonService.getLessonPdf(req.params.id);

    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `inline; filename="${originalName}"`);
    res.send(data);
});


export {
   createLesson,
   getLessons,
   getLessonById,
   updateLesson,
   deleteLesson,
   getLessonPdf
};