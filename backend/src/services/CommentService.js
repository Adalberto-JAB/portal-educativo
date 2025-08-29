import Comment from '../models/Comment.js';
import User from '../models/User.js';
import ForumPost from '../models/ForumPost.js';
import mongoose from 'mongoose';

const CommentService = {
   /**
    * @desc Crea un nuevo comentario.
    * @param {object} commentData - Datos del comentario.
    * @returns {object} El comentario creado.
    * @throws {Error} Si los datos son inválidos o los IDs referenciados no existen.
    */
   createComment: async (commentData) => {
       const { text, author, forumPost } = commentData;

       const authorExists = await User.findById(author);
       if (!authorExists) {
           throw new Error('El autor especificado no existe.');
       }
       const forumPostExists = await ForumPost.findById(forumPost);
       if (!forumPostExists) {
           throw new Error('El post de foro especificado no existe.');
       }

       const comment = await Comment.create({
           text,
           author,
           forumPost,
           isApproved: false
       });

       if (!comment) {
           throw new Error('Datos de comentario inválidos.');
       }

       forumPostExists.commentsCount = (forumPostExists.commentsCount || 0) + 1;
       await forumPostExists.save();

       return comment;
   },

   /**
    * @desc Obtiene todos los comentarios, opcionalmente filtrados por post de foro.
    * @param {string} [forumPostId] - ID del post de foro para filtrar.
    * @param {object} currentUser - Usuario autenticado (para filtrar por aprobación).
    * @returns {Array<object>} Lista de comentarios.
    * @throws {Error} Si el ID de post de foro es inválido.
    */
   getComments: async (forumPostId, currentUser) => {
       let query = {};
       if (forumPostId) {
           if (!mongoose.Types.ObjectId.isValid(forumPostId)) {
               throw new Error('ID de post de foro inválido.');
           }
           query.forumPost = forumPostId;
       }

       if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) {
           query.isApproved = true;
       }

       return await Comment.find(query)
           .populate('author', 'name last_name profilePictureURL')
           .populate('forumPost', 'title')
           .sort({ createdAt: 1 });
   },

   /**
    * @desc Obtiene un comentario por su ID.
    * @param {string} id - ID del comentario.
    * @param {object} currentUser - Usuario autenticado (para verificar aprobación).
    * @returns {object} El comentario encontrado.
    * @throws {Error} Si el comentario no es encontrado o no está autorizado.
    */
   getCommentById: async (id, currentUser) => {
       const comment = await Comment.findById(id)
           .populate('author', 'name last_name profilePictureURL')
           .populate('forumPost', 'title');
       if (!comment) {
           throw new Error('Comentario no encontrado.');
       }

       if (!comment.isApproved && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher'))) {
           throw new Error('Este comentario no está aprobado y no tienes permiso para verlo.');
       }
       return comment;
   },

   /**
    * @desc Actualiza un comentario.
    * @param {string} id - ID del comentario a actualizar.
    * @param {object} updateData - Datos a actualizar.
    * @param {object} currentUser - Usuario que realiza la actualización.
    * @returns {object} El comentario actualizado.
    * @throws {Error} Si el comentario no es encontrado o no está autorizado.
    */
   updateComment: async (id, updateData, currentUser) => {
       const { text, isApproved } = updateData;
       const comment = await Comment.findById(id);

       if (!comment) {
           throw new Error('Comentario no encontrado.');
       }

       const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher' || comment.author.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para actualizar este comentario.');
       }

       comment.text = text || comment.text;
       if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
           comment.isApproved = isApproved !== undefined ? isApproved : comment.isApproved;
       }

       const updatedComment = await comment.save();
       return updatedComment;
   },

   /**
    * @desc Elimina un comentario.
    * @param {string} id - ID del comentario a eliminar.
    * @param {object} currentUser - Usuario que realiza la eliminación.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si el comentario no es encontrado o no está autorizado.
    */
   deleteComment: async (id, currentUser) => {
       const comment = await Comment.findById(id);
       if (!comment) {
           throw new Error('Comentario no encontrado.');
       }

       const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher' || comment.author.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para eliminar este comentario.');
       }

       const forumPost = await ForumPost.findById(comment.forumPost);
       await Comment.deleteOne({ _id: comment._id });

       if (forumPost) {
           forumPost.commentsCount = Math.max(0, (forumPost.commentsCount || 0) - 1);
           await forumPost.save();
       }
       return { message: 'Comentario eliminado correctamente.' };
   },

   /**
    * @desc Aprueba o desaprueba un comentario.
    * @param {string} id - ID del comentario.
    * @param {boolean} isApproved - Estado de aprobación.
    * @returns {object} El comentario actualizado.
    * @throws {Error} Si el comentario no es encontrado.
    */
   approveComment: async (id, isApproved) => {
       const comment = await Comment.findById(id);
       if (!comment) {
           throw new Error('Comentario no encontrado.');
       }
       comment.isApproved = isApproved !== undefined ? isApproved : !comment.isApproved;
       const updatedComment = await comment.save();
       return updatedComment;
   }
};

export default CommentService;
