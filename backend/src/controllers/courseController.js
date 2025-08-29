import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import CourseService from '../services/CourseService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear un nuevo curso
// @route   POST /api/courses
// @access  Private/Admin, Teacher
const createCourse = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const course = await CourseService.createCourse(req.body);
   res.status(201).json(course);
});

// @desc    Obtener todos los cursos
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
   const courses = await CourseService.getCourses();
   res.json(courses);
});

// @desc    Obtener los cursos del usuario autenticado
// @route   GET /api/courses/my-courses
// @access  Private/Teacher, Admin
const getMyCourses = asyncHandler(async (req, res) => {
   const courses = await CourseService.getCoursesByAuthor(req.user._id);
   res.json(courses);
});

// @desc    Obtener curso por ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const course = await CourseService.getCourseById(req.params.id);
   res.json(course);
});

// @desc    Actualizar curso
// @route   PUT /api/courses/:id
// @access  Private/Admin, Teacher
const updateCourse = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedCourse = await CourseService.updateCourse(req.params.id, req.body);
   res.json(updatedCourse);
});

// @desc    Eliminar curso
// @route   DELETE /api/courses/:id
// @access  Private/Admin, Teacher
const deleteCourse = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await CourseService.deleteCourse(req.params.id);
   res.json(message);
});

export {
   createCourse,
   getCourses,
   getMyCourses,
   getCourseById,
   updateCourse,
   deleteCourse
};