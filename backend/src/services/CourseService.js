import Course from '../models/Course.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Cover from '../models/Cover.js';

const CourseService = {
   /**
    * @desc Crea un nuevo curso.
    * @param {object} courseData - Datos del curso.
    * @returns {object} El curso creado.
    * @throws {Error} Si el curso ya existe o los IDs referenciados no existen.
    */
   createCourse: async (courseData) => {
       const { title, description, author, subject, nivel, cover, isPublished, isGuestViewable } = courseData;

       const courseExists = await Course.findOne({ title });
       if (courseExists) {
           throw new Error('Ya existe un curso con este título.');
       }

       const authorExists = await User.findById(author);
       if (!authorExists) {
           throw new Error('El autor especificado no existe.');
       }
       const subjectExists = await Subject.findById(subject);
       if (!subjectExists) {
           throw new Error('La materia especificada no existe.');
       }
       if (cover) {
           const coverExists = await Cover.findById(cover);
           if (!coverExists) {
               throw new Error('La portada especificada no existe.');
           }
       }

       const course = await Course.create({
           title,
           description,
           author,
           subject,
           nivel,
           cover,
           isPublished: isPublished || false,
           isGuestViewable: isGuestViewable || false
       });

       if (!course) {
           throw new Error('Datos de curso inválidos.');
       }
       return course;
   },

   /**
    * @desc Obtiene todos los cursos.
    * @returns {Array<object>} Lista de cursos.
    */
   getCourses: async () => {
                     return await Course.find({})
           .populate('author', 'name last_name')
           .populate('subject', 'name')
           .populate('cover', 'name contentType');
   },

   /**
    * @desc Obtiene un curso por su ID.
    * @param {string} id - ID del curso.
    * @returns {object} El curso encontrado.
    * @throws {Error} Si el curso no es encontrado.
    */
   getCourseById: async (id) => {
       const course = await Course.findById(id)
           .populate('author', 'name last_name')
           .populate('subject', 'name')
           .populate('cover');
       if (!course) {
           throw new Error('Curso no encontrado.');
       }
       return course;
   },

   /**
    * @desc Actualiza un curso.
    * @param {string} id - ID del curso a actualizar.
    * @param {object} updateData - Datos a actualizar.
    * @returns {object} El curso actualizado.
    * @throws {Error} Si el curso no es encontrado, el título ya existe o los IDs referenciados no existen.
    */
   updateCourse: async (id, updateData) => {
       const course = await Course.findById(id);

       if (!course) {
           throw new Error('Curso no encontrado.');
       }

       // Validaciones
       if (updateData.title && updateData.title !== course.title) {
           const courseExists = await Course.findOne({ title: updateData.title });
           if (courseExists) {
               throw new Error('Ya existe otro curso con este título.');
           }
       }
       if (updateData.author && !(await User.findById(updateData.author))) {
           throw new Error('El autor especificado no existe.');
       }
       if (updateData.subject && !(await Subject.findById(updateData.subject))) {
           throw new Error('La materia especificada no existe.');
       }
       if (updateData.cover && !(await Cover.findById(updateData.cover))) {
           throw new Error('La portada especificada no existe.');
       }

       // Aplicar actualizaciones solo para los campos proporcionados en updateData
       Object.keys(updateData).forEach(key => {
           course[key] = updateData[key];
       });

       const updatedCourse = await course.save();
       return updatedCourse;
   },

   /**
    * @desc Elimina un curso.
    * @param {string} id - ID del curso a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si el curso no es encontrado.
    */
   deleteCourse: async (id) => {
       const course = await Course.findById(id);
       if (!course) {
           throw new Error('Curso no encontrado.');
       }
       await Course.deleteOne({ _id: course._id });
       return { message: 'Curso eliminado correctamente.' };
   },

   /**
    * @desc Obtiene todos los cursos de un autor específico.
    * @param {string} authorId - ID del autor.
    * @returns {Array<object>} Lista de cursos del autor.
    */
   getCoursesByAuthor: async (authorId) => {
       return await Course.find({ author: authorId })
           .populate('author', 'name last_name')
           .populate('subject', 'name')
           .populate('cover', 'name contentType');
   }
};

export default CourseService;
