import express from 'express';
import {
   createForumPost,
   getForumPosts,
   getForumPostById,
   updateForumPost,
   deleteForumPost,
   approveForumPost
} from '../controllers/forumPostController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import forumPostValidationRules from '../validations/ForumPostValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.route('/')
   .post(protect, forumPostValidationRules.create, createForumPost) // Cualquier usuario autenticado puede crear un post
   .get(getAuthUser, getForumPosts); // Cualquiera puede ver los posts (filtrado por isApproved para no-admins/teachers)

router.route('/:id')
   .get(getAuthUser, forumPostValidationRules.getById, getForumPostById) // Cualquiera puede ver un post por ID (filtrado por isApproved)
   .put(protect, forumPostValidationRules.update, updateForumPost) // Admin, Teacher o el autor
   .delete(protect, deleteForumPost); // Admin, Teacher o el autor

router.put('/:id/approve', protect, authorizeRoles('admin', 'teacher'), forumPostValidationRules.approve, approveForumPost); // Solo admin/teacher

export default router;
