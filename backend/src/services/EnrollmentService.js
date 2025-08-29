import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import mongoose from 'mongoose';

const EnrollmentService = {
   /**
    * @desc Crea una nueva inscripción.
    * @param {object} enrollmentData - Datos de la inscripción.
    * @returns {object} La inscripción creada.
    * @throws {Error} Si los datos son inválidos, los IDs referenciados no existen o la inscripción ya existe.
    */
   createEnrollment: async (enrollmentData) => {
       const { user, course } = enrollmentData;

       const userExists = await User.findById(user);
       if (!userExists) {
           throw new Error('El usuario especificado no existe.');
       }
       const courseExists = await Course.findById(course);
       if (!courseExists) {
           throw new Error('El curso especificado no existe.');
       }

       const existingEnrollment = await Enrollment.findOne({ user, course });
       if (existingEnrollment) {
           throw new Error('Este usuario ya está inscrito en este curso.');
       }

       const enrollment = await Enrollment.create({
           user,
           course,
           completedLessons: [],
           enrollmentDate: Date.now(),
           status: 'in_progress'
       });

       if (!enrollment) {
           throw new Error('Datos de inscripción inválidos.');
       }
       return enrollment;
   },

   /**
    * @desc Obtiene todas las inscripciones, opcionalmente filtradas por usuario o curso.
    * @param {object} filters - Filtros (userId, courseId).
    * @param {object} currentUser - Usuario autenticado (para control de acceso).
    * @returns {Array<object>} Lista de inscripciones.
    * @throws {Error} Si los IDs de filtro son inválidos o no está autorizado.
    */
   getEnrollments: async (filters, currentUser) => {
       const { userId, courseId } = filters;
       let query = {};

       if (currentUser.role !== 'admin' && currentUser.role !== 'teacher') {
           query.user = currentUser._id;
       } else {
           if (userId) {
               if (!mongoose.Types.ObjectId.isValid(userId)) {
                   throw new Error('ID de usuario inválido.');
               }
               query.user = userId;
           }
           if (courseId) {
               if (!mongoose.Types.ObjectId.isValid(courseId)) {
                   throw new Error('ID de curso inválido.');
               }
               query.course = courseId;
           }
       }

       return await Enrollment.find(query)
           .populate('user', 'name last_name email')
           .populate('course', 'title description')
           .populate('completedLessons', 'title order');
   },

   /**
    * @desc Obtiene una inscripción por su ID.
    * @param {string} id - ID de la inscripción.
    * @param {object} currentUser - Usuario autenticado (para control de acceso).
    * @returns {object} La inscripción encontrada.
    * @throws {Error} Si la inscripción no es encontrada o no está autorizado.
    */
   getEnrollmentById: async (id, currentUser) => {
       const enrollment = await Enrollment.findById(id)
           .populate('user', 'name last_name email')
           .populate('course', 'title description')
           .populate('completedLessons', 'title order');

       if (!enrollment) {
           throw new Error('Inscripción no encontrada.');
       }

       const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher' || enrollment.user.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para ver esta inscripción.');
       }
       return enrollment;
   },

   /**
    * @desc Actualiza una inscripción.
    * @param {string} id - ID de la inscripción a actualizar.
    * @param {object} updateData - Datos a actualizar (completedLessons, status, completionDate).
    * @param {object} currentUser - Usuario que realiza la actualización.
    * @returns {object} La inscripción actualizada.
    * @throws {Error} Si la inscripción no es encontrada o no está autorizado.
    */
   updateEnrollment: async (id, updateData, currentUser) => {
       const { completedLessons, status, completionDate } = updateData;
       const enrollment = await Enrollment.findById(id);

       if (!enrollment) {
           throw new Error('Inscripción no encontrada.');
       }

       const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'teacher' || enrollment.user.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para actualizar esta inscripción.');
       }

       if (completedLessons) {
           const courseLessons = await Lesson.find({ course: enrollment.course });
           const validLessonIds = courseLessons.map(lesson => lesson._id.toString());
           const newCompletedLessons = completedLessons.filter(lessonId => validLessonIds.includes(lessonId));
           enrollment.completedLessons = [...new Set([...enrollment.completedLessons.map(id => id.toString()), ...newCompletedLessons])];
       }

       if (status) {
           enrollment.status = status;
           if (status === 'completed' && !enrollment.completionDate) {
               enrollment.completionDate = completionDate || Date.now();
           } else if (status !== 'completed') {
               enrollment.completionDate = undefined;
           }
       }

       const updatedEnrollment = await enrollment.save();
       return updatedEnrollment;
   },

   /**
    * @desc Elimina una inscripción.
    * @param {string} id - ID de la inscripción a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la inscripción no es encontrada.
    */
   deleteEnrollment: async (id) => {
       const enrollment = await Enrollment.findById(id);
       if (!enrollment) {
           throw new Error('Inscripción no encontrada.');
       }
       await Enrollment.deleteOne({ _id: enrollment._id });
       return { message: 'Inscripción eliminada correctamente.' };
   },

   /**
    * @desc Verifica si un usuario está inscrito en un curso.
    * @param {string} userId - ID del usuario.
    * @param {string} courseId - ID del curso.
    * @returns {object} Objeto con el estado de la inscripción.
    */
   getEnrollmentStatus: async (userId, courseId) => {
       const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
       return { isEnrolled: !!existingEnrollment };
   }
};

export default EnrollmentService;