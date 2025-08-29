import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import CoverService from '../services/CoverService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear una nueva portada
// @route   POST /api/covers
// @access  Private/Admin, Teacher
const createCover = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   if (!req.file) {
       res.status(400);
       throw new Error('El archivo de imagen es requerido.');
   }

   const cover = await CoverService.createCover(req.body, req.file);
   res.status(201).json(cover);
});

// @desc    Obtener todas las portadas
// @route   GET /api/covers
// @access  Public
const getCovers = asyncHandler(async (req, res) => {
   const covers = await CoverService.getCovers();
   res.json(covers);
});

// @desc    Obtener portada por ID
// @route   GET /api/covers/:id
// @access  Public
const getCoverById = asyncHandler(async (req, res) => {
   const cover = await CoverService.getCoverById(req.params.id);
   if (!cover) {
       res.status(404);
       throw new Error('Portada no encontrada.');
   }

   res.set('Content-Type', cover.contentType);
   res.send(cover.data);
});

// @desc    Actualizar portada
// @route   PUT /api/covers/:id
// @access  Private/Admin, Teacher
const updateCover = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedCover = await CoverService.updateCover(req.params.id, req.body, req.file);
   res.json(updatedCover);
});

// @desc    Eliminar portada
// @route   DELETE /api/covers/:id
// @access  Private/Admin, Teacher
const deleteCover = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await CoverService.deleteCover(req.params.id);
   res.json(message);
});

export {
   createCover,
   getCovers,
   getCoverById,
   updateCover,
   deleteCover
};
