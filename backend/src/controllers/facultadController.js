import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import FacultadService from '../services/FacultadService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear una nueva facultad
// @route   POST /api/facultades
// @access  Private/Admin
const createFacultad = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const facultad = await FacultadService.createFacultad(req.body);
   res.status(201).json(facultad);
});

// @desc    Obtener todas las facultades
// @route   GET /api/facultades
// @access  Public
const getFacultades = asyncHandler(async (req, res) => {
   const facultades = await FacultadService.getFacultades();
   res.json(facultades);
});

// @desc    Obtener facultad por ID
// @route   GET /api/facultades/:id
// @access  Public
const getFacultadById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const facultad = await FacultadService.getFacultadById(req.params.id);
   res.json(facultad);
});

// @desc    Actualizar facultad
// @route   PUT /api/facultades/:id
// @access  Private/Admin
const updateFacultad = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedFacultad = await FacultadService.updateFacultad(req.params.id, req.body);
   res.json(updatedFacultad);
});

// @desc    Eliminar facultad
// @route   DELETE /api/facultades/:id
// @access  Private/Admin
const deleteFacultad = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await FacultadService.deleteFacultad(req.params.id);
   res.json(message);
});

export {
   createFacultad,
   getFacultades,
   getFacultadById,
   updateFacultad,
   deleteFacultad
};
