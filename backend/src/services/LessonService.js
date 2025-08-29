import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const LessonService = {
    /**
     * Verifica si el usuario es el propietario del curso o un administrador.
     * @param {object} user - El objeto de usuario autenticado.
     * @param {object} ids - Objeto con `courseId` o `lessonId`.
     * @throws {Error} Si el usuario no está autorizado.
     */
    _verifyOwnership: async (user, { courseId, lessonId }) => {
        if (user.role === 'admin') {
            return; // Los administradores tienen acceso total.
        }

        let courseToVerify;
        if (lessonId) {
            const lesson = await Lesson.findById(lessonId).populate('course');
            if (!lesson) {
                throw new Error('Lección no encontrada.');
            }
            courseToVerify = lesson.course;
        } else if (courseId) {
            courseToVerify = await Course.findById(courseId);
        }

        if (!courseToVerify) {
            throw new Error('Curso no encontrado.');
        }

        if (courseToVerify.author.toString() !== user._id.toString()) {
            const error = new Error('No autorizado para realizar esta acción en el curso.');
            error.statusCode = 403; // Forbidden
            throw error;
        }
    },

   /**
    * @desc Crea una nueva lección.
    * @param {object} lessonData - Datos de la lección (title, description, course, order).
    * @param {object} file - Objeto de archivo (buffer, mimetype, originalname) de Multer.
    * @param {object} user - El usuario autenticado que realiza la acción.
    * @returns {object} La lección creada.
    * @throws {Error} Si los datos son inválidos, el curso no existe o el orden ya está ocupado.
    */
   createLesson: async (lessonData, file, user) => {
       const { title, description, course, order } = lessonData;

       // 1. Verificar permisos
       await LessonService._verifyOwnership(user, { courseId: course });

       if (!file) {
           throw new Error('El archivo PDF de la lección es requerido.');
       }
       if (file.mimetype !== 'application/pdf') {
           throw new Error('Solo se permiten archivos PDF.');
       }

       const courseExists = await Course.findById(course);
       if (!courseExists) {
           throw new Error('El curso especificado no existe.');
       }

       const existingLessonOrder = await Lesson.findOne({ course, order });
       if (existingLessonOrder) {
           throw new Error(`Ya existe una lección con el orden ${order} en este curso.`);
       }

       const lesson = await Lesson.create({
           title,
           description,
           course,
           order,
           uploadedBy: user._id, // Forzar el ID del usuario autenticado
           pdfData: file.buffer,
           pdfContentType: file.mimetype,
           pdfOriginalName: file.originalname
       });

       if (!lesson) {
           throw new Error('Datos de lección inválidos.');
       }
       return lesson;
   },

   /**
    * @desc Obtiene todas las lecciones, opcionalmente filtradas por curso.
    * @param {string} [courseId] - ID del curso para filtrar.
    * @returns {Array<object>} Lista de lecciones (sin datos de PDF).
    * @throws {Error} Si el ID de curso es inválido.
    */
   getLessons: async (courseId) => {
       let query = {};
       if (courseId) {
           if (!mongoose.Types.ObjectId.isValid(courseId)) {
               throw new Error('ID de curso inválido.');
           }
           query.course = courseId;
       }

       return await Lesson.find(query)
           .select('-pdfData') // Excluir datos binarios del PDF para la lista
           .populate('course', 'title')
           .populate('uploadedBy', 'name last_name')
           .sort({ order: 1 });
   },

   /**
    * @desc Obtiene una lección por su ID (sin datos de PDF).
    * @param {string} id - ID de la lección.
    * @returns {object} La lección encontrada.
    * @throws {Error} Si la lección no es encontrada.
    */
   getLessonById: async (id) => {
       const lesson = await Lesson.findById(id)
           .select('-pdfData') // Excluir datos binarios del PDF
           .populate('course', 'title')
           .populate('uploadedBy', 'name last_name');
       if (!lesson) {
           throw new Error('Lección no encontrada.');
       }
       return lesson;
   },

   /**
    * @desc Obtiene los datos de un PDF de lección por su ID.
    * @param {string} id - ID de la lección.
    * @returns {object} Objeto con los datos binarios y el tipo de contenido del PDF.
    * @throws {Error} Si la lección o el PDF no son encontrados.
    */
   getLessonPdf: async (id) => {
       const lesson = await Lesson.findById(id);
       if (!lesson || !lesson.pdfData || !lesson.pdfContentType) {
           throw new Error('PDF de lección no encontrado.');
       }
       return { data: lesson.pdfData, contentType: lesson.pdfContentType, originalName: lesson.pdfOriginalName };
   },

   /**
    * @desc Actualiza una lección.
    * @param {string} id - ID de la lección a actualizar.
    * @param {object} updateData - Datos a actualizar.
    * @param {object} [file] - Objeto de archivo (buffer, mimetype, originalname) de Multer (opcional).
    * @param {object} user - El usuario autenticado que realiza la acción.
    * @returns {object} La lección actualizada.
    * @throws {Error} Si la lección no es encontrada o el usuario no está autorizado.
    */
   updateLesson: async (id, updateData, file, user) => {
        // 1. Verificar permisos
        await LessonService._verifyOwnership(user, { lessonId: id });

       const lesson = await Lesson.findById(id);
       if (!lesson) {
           throw new Error('Lección no encontrada.');
       }

       // No permitir cambiar el curso de una lección o el autor
       delete updateData.course;
       delete updateData.uploadedBy;

       // Validar unicidad del orden si se actualiza
       if (updateData.order !== undefined && updateData.order !== lesson.order) {
           const existingLessonWithNewOrder = await Lesson.findOne({
               course: lesson.course,
               order: updateData.order,
               _id: { $ne: lesson._id }
           });

           if (existingLessonWithNewOrder) {
               throw new Error(`Ya existe una lección con el orden ${updateData.order} en este curso.`);
           }
       }

       // Actualizar campos de texto
       Object.assign(lesson, updateData);

       // Actualizar campos de archivo si se proporciona un nuevo archivo
       if (file) {
           if (file.mimetype !== 'application/pdf') {
               throw new Error('Solo se permiten archivos PDF.');
           }
           lesson.pdfData = file.buffer;
           lesson.pdfContentType = file.mimetype;
           lesson.pdfOriginalName = file.originalname;
       }

       const updatedLesson = await lesson.save();
       return updatedLesson;
   },

   /**
    * @desc Elimina una lección.
    * @param {string} id - ID de la lección a eliminar.
    * @param {object} user - El usuario autenticado que realiza la acción.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la lección no es encontrada o el usuario no está autorizado.
    */
   deleteLesson: async (id, user) => {
        // 1. Verificar permisos
        await LessonService._verifyOwnership(user, { lessonId: id });

       const lesson = await Lesson.findById(id);
       if (!lesson) {
           throw new Error('Lección no encontrada.');
       }
       await Lesson.deleteOne({ _id: lesson._id });
       return { message: 'Lección eliminada correctamente.' };
   }
};

export default LessonService;