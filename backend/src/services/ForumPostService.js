import ForumPost from '../models/ForumPost.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Comment from '../models/Comment.js';

const ForumPostService = {
   /**
    * @desc Crea un nuevo post de foro.
    * @param {object} postData - Datos del post.
    * @returns {object} El post de foro creado.
    * @throws {Error} Si los datos son inválidos o los IDs referenciados no existen.
    */
   createForumPost: async (postData) => {
       const { title, content, subject, author } = postData;

       const authorExists = await User.findById(author);
       if (!authorExists) {
           throw new Error('El autor especificado no existe.');
       }
       const subjectExists = await Subject.findById(subject);
       if (!subjectExists) {
           throw new Error('La materia especificada no existe.');
       }

       const forumPost = await ForumPost.create({
           title,
           content,
           subject,
           author,
           isApproved: false,
           commentsCount: 0
       });

       if (!forumPost) {
           throw new Error('Datos de post de foro inválidos.');
       }
       return forumPost;
   },

   /**
    * @desc Obtiene todos los posts de foro.
    * @param {object} currentUser - Usuario autenticado (para filtrar por aprobación).
    * @returns {Array<object>} Lista de posts de foro.
    */
   getForumPosts: async (currentUser) => {
       let query = {};
       if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) {
           query.isApproved = true;
       }

       return await ForumPost.find(query)
           .populate('author', 'name last_name')
           .populate('subject', 'name')
           .sort({ createdAt: -1 });
   },

   /**
    * @desc Obtiene un post de foro por su ID.
    * @param {string} id - ID del post.
    * @param {object} currentUser - Usuario autenticado (para verificar aprobación).
    * @returns {object} El post de foro encontrado.
    * @throws {Error} Si el post no es encontrado o no está autorizado.
    */
   getForumPostById: async (id, currentUser) => {
       const forumPost = await ForumPost.findById(id)
           .populate('author', 'name last_name')
           .populate('subject', 'name');
       if (!forumPost) {
           throw new Error('Post de foro no encontrado.');
       }

       if (!forumPost.isApproved && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher'))) {
           throw new Error('Este post no está aprobado y no tienes permiso para verlo.');
       }
       return forumPost;
   },

   /**
    * @desc Actualiza un post de foro.
    * @param {string} id - ID del post a actualizar.
    * @param {object} updateData - Datos a actualizar.
    * @param {object} currentUser - Usuario que realiza la actualización.
    * @returns {object} El post de foro actualizado.
    * @throws {Error} Si el post no es encontrado, no está autorizado o la materia no existe.
    */
   updateForumPost: async (id, updateData, currentUser) => {
       const { title, content, subject, isApproved } = updateData;
       const forumPost = await ForumPost.findById(id);

       if (!forumPost) {
           throw new Error('Post de foro no encontrado.');
       }

       const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher' || forumPost.author.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para actualizar este post.');
       }

       if (subject) {
           const subjectExists = await Subject.findById(subject);
           if (!subjectExists) {
               throw new Error('La materia especificada no existe.');
           }
       }

       forumPost.title = title || forumPost.title;
       forumPost.content = content || forumPost.content;
       forumPost.subject = subject || forumPost.subject;

       if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
           forumPost.isApproved = isApproved !== undefined ? isApproved : forumPost.isApproved;
       }

       const updatedForumPost = await forumPost.save();
       return updatedForumPost;
   },

   /**
    * @desc Elimina un post de foro.
    * @param {string} id - ID del post a eliminar.
    * @param {object} currentUser - Usuario que realiza la eliminación.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si el post no es encontrado o no está autorizado.
    */
   deleteForumPost: async (id, currentUser) => {
       const forumPost = await ForumPost.findById(id);
       if (!forumPost) {
           throw new Error('Post de foro no encontrado.');
       }

       const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher' || forumPost.author.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para eliminar este post.');
       }

       await ForumPost.deleteOne({ _id: forumPost._id });
       await Comment.deleteMany({ forumPost: forumPost._id });
       return { message: 'Post de foro y sus comentarios asociados eliminados correctamente.' };
   },

   /**
    * @desc Aprueba o desaprueba un post de foro.
    * @param {string} id - ID del post.
    * @param {boolean} isApproved - Estado de aprobación.
    * @returns {object} El post de foro actualizado.
    * @throws {Error} Si el post no es encontrado.
    */
   approveForumPost: async (id, isApproved) => {
       const forumPost = await ForumPost.findById(id);
       if (!forumPost) {
           throw new Error('Post de foro no encontrado.');
       }
       forumPost.isApproved = isApproved !== undefined ? isApproved : !forumPost.isApproved;
       const updatedForumPost = await forumPost.save();
       return updatedForumPost;
   }
};

export default ForumPostService;
