import express from 'express';
import {
   createComment,
   getComments,
   getCommentById,
   updateComment,
   deleteComment,
   approveComment
} from '../controllers/commentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import commentValidationRules from '../validations/CommentValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, commentValidationRules.create, createComment) // Cualquier usuario autenticado puede crear un comentario
   .get(protect, commentValidationRules.getComments, getComments); // Cualquiera puede ver los comentarios (filtrado por isApproved)

router.route('/:id')
   .get(commentValidationRules.getById, getCommentById) // Cualquiera puede ver un comentario por ID (filtrado por isApproved)
   .put(protect, commentValidationRules.update, updateComment) // Admin, Teacher o el autor
   .delete(protect, deleteComment); // Admin, Teacher o el autor

router.put('/:id/approve', protect, authorizeRoles('admin', 'teacher'), commentValidationRules.approve, approveComment); // Solo admin/teacher

export default router;
