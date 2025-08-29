import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import CommentService from '../services/CommentService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear un nuevo comentario
// @route   POST /api/comments
// @access  Private (Authenticated users)
const createComment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const comment = await CommentService.createComment(req.body);
   res.status(201).json(comment);
});

// @desc    Obtener todos los comentarios (opcionalmente por forumPost)
// @route   GET /api/comments
// @route   GET /api/comments?forumPostId=...
// @access  Public (filtered by isApproved for guests/students)
const getComments = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación para query params

   const comments = await CommentService.getComments(req.query.forumPostId, req.user); // Pasar req.user
   res.json(comments);
});

// @desc    Obtener comentario por ID
// @route   GET /api/comments/:id
// @access  Public (check isApproved for guests/students)
const getCommentById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const comment = await CommentService.getCommentById(req.params.id, req.user); // Pasar req.user
   res.json(comment);
});

// @desc    Actualizar comentario
// @route   PUT /api/comments/:id
// @access  Private/Admin, Teacher o el propio autor
const updateComment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedComment = await CommentService.updateComment(req.params.id, req.body, req.user); // Pasar req.user
   res.json(updatedComment);
});

// @desc    Eliminar comentario
// @route   DELETE /api/comments/:id
// @access  Private/Admin, Teacher o el propio autor
const deleteComment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await CommentService.deleteComment(req.params.id, req.user); // Pasar req.user
   res.json(message);
});

// @desc    Aprobar o desaprobar un comentario
// @route   PUT /api/comments/:id/approve
// @access  Private/Admin, Teacher
const approveComment = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const { isApproved } = req.body;
   const updatedComment = await CommentService.approveComment(req.params.id, isApproved);
   res.json(updatedComment);
});

export {
   createComment,
   getComments,
   getCommentById,
   updateComment,
   deleteComment,
   approveComment
};
