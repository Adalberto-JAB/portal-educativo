import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import ProfilePictureService from '../services/ProfilePictureService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Subir una nueva imagen de perfil
// @route   POST /api/profilepictures
// @access  Private (Authenticated users)
const createProfilePicture = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   if (!req.file) {
       res.status(400);
       throw new Error('El archivo de imagen es requerido.');
   }

   const profilePicture = await ProfilePictureService.createProfilePicture(req.body, req.file);
   res.status(201).json(profilePicture);
});

// @desc    Obtener imagen de perfil por ID
// @route   GET /api/profilepictures/:id
// @access  Public
const getProfilePictureById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const profilePicture = await ProfilePictureService.getProfilePictureById(req.params.id);
   res.set('Content-Type', profilePicture.contentType);
   res.send(profilePicture.data);
});

// @desc    Actualizar imagen de perfil
// @route   PUT /api/profilepictures/:id
// @access  Private (Authenticated users, or Admin)
const updateProfilePicture = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedProfilePicture = await ProfilePictureService.updateProfilePicture(req.params.id, req.body, req.file, req.user); // Pasar req.user
   res.json(updatedProfilePicture);
});

// @desc    Eliminar imagen de perfil
// @route   DELETE /api/profilepictures/:id
// @access  Private (Authenticated users, or Admin)
const deleteProfilePicture = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await ProfilePictureService.deleteProfilePicture(req.params.id, req.user); // Pasar req.user
   res.json(message);
});

export {
   createProfilePicture,
   getProfilePictureById,
   updateProfilePicture,
   deleteProfilePicture
};
