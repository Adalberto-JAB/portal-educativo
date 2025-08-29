import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import CarreraService from '../services/CarreraService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear una nueva carrera
// @route   POST /api/carreras
// @access  Private/Admin
const createCarrera = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const carrera = await CarreraService.createCarrera(req.body);
   res.status(201).json(carrera);
});

// @desc    Obtener todas las carreras
// @route   GET /api/carreras
// @access  Public
const getCarreras = asyncHandler(async (req, res) => {
   const carreras = await CarreraService.getCarreras();
   res.json(carreras);
});

// @desc    Obtener carrera por ID
// @route   GET /api/carreras/:id
// @access  Public
const getCarreraById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const carrera = await CarreraService.getCarreraById(req.params.id);
   res.json(carrera);
});

// @desc    Actualizar carrera
// @route   PUT /api/carreras/:id
// @access  Private/Admin
const updateCarrera = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedCarrera = await CarreraService.updateCarrera(req.params.id, req.body);
   res.json(updatedCarrera);
});

// @desc    Eliminar carrera
// @route   DELETE /api/carreras/:id
// @access  Private/Admin
const deleteCarrera = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await CarreraService.deleteCarrera(req.params.id);
   res.json(message);
});

export {
   createCarrera,
   getCarreras,
   getCarreraById,
   updateCarrera,
   deleteCarrera
};
