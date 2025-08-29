import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import NivelService from '../services/NivelService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear un nuevo nivel
// @route   POST /api/niveles
// @access  Private/Admin
const createNivel = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const nivel = await NivelService.createNivel(req.body);
   res.status(201).json(nivel);
});

// @desc    Obtener todos los niveles
// @route   GET /api/niveles
// @access  Public
const getNiveles = asyncHandler(async (req, res) => {
   const niveles = await NivelService.getNiveles();
   res.json(niveles);
});

// @desc    Obtener nivel por ID
// @route   GET /api/niveles/:id
// @access  Public
const getNivelById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const nivel = await NivelService.getNivelById(req.params.id);
   res.json(nivel);
});

// @desc    Actualizar nivel
// @route   PUT /api/niveles/:id
// @access  Private/Admin
const updateNivel = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedNivel = await NivelService.updateNivel(req.params.id, req.body);
   res.json(updatedNivel);
});

// @desc    Eliminar nivel
// @route   DELETE /api/niveles/:id
// @access  Private/Admin
const deleteNivel = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await NivelService.deleteNivel(req.params.id);
   res.json(message);
});

export {
   createNivel,
   getNiveles,
   getNivelById,
   updateNivel,
   deleteNivel
};
