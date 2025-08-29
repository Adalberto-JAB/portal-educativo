import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import ForumPostService from '../services/ForumPostService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Crear un nuevo post de foro
// @route   POST /api/forumposts
// @access  Private (Authenticated users)
const createForumPost = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const forumPost = await ForumPostService.createForumPost(req.body);
   res.status(201).json(forumPost);
});

// @desc    Obtener todos los posts de foro (solo aprobados para usuarios no admin/teacher)
// @route   GET /api/forumposts
// @access  Public (filtered by isApproved for guests/students)
const getForumPosts = asyncHandler(async (req, res) => {
   const forumPosts = await ForumPostService.getForumPosts(req.user); // Pasar req.user para control de aprobación
   res.json(forumPosts);
});

// @desc    Obtener post de foro por ID
// @route   GET /api/forumposts/:id
// @access  Public (check isApproved for guests/students)
const getForumPostById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const forumPost = await ForumPostService.getForumPostById(req.params.id, req.user); // Pasar req.user
   res.json(forumPost);
});

// @desc    Actualizar post de foro
// @route   PUT /api/forumposts/:id
// @access  Private/Admin, Teacher o el propio autor
const updateForumPost = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedForumPost = await ForumPostService.updateForumPost(req.params.id, req.body, req.user); // Pasar req.user
   res.json(updatedForumPost);
});

// @desc    Eliminar post de foro
// @route   DELETE /api/forumposts/:id
// @access  Private/Admin, Teacher o el propio autor
const deleteForumPost = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await ForumPostService.deleteForumPost(req.params.id, req.user); // Pasar req.user
   res.json(message);
});

// @desc    Aprobar o desaprobar un post de foro
// @route   PUT /api/forumposts/:id/approve
// @access  Private/Admin, Teacher
const approveForumPost = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const { isApproved } = req.body;
   const updatedForumPost = await ForumPostService.approveForumPost(req.params.id, isApproved);
   res.json(updatedForumPost);
});

export {
   createForumPost,
   getForumPosts,
   getForumPostById,
   updateForumPost,
   deleteForumPost,
   approveForumPost
};
