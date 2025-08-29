import asyncHandler from 'express-async-handler';
import SubjectService from '../services/SubjectService.js'; // Importar el servicio de Materias
import { validationResult } from 'express-validator';
import subjectValidationRules from '../validations/SubjectValidationRules.js'; // Importar reglas de validación para vistas

// Función auxiliar para manejar errores de validación en vistas
const handleViewValidationErrors = (req, res, viewName, data = {}) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.render(viewName, {
           title: data.title || 'Error de Validación',
           body: '',
           ...data,
           message: errors.array().map(err => err.msg).join(', ')
       });
   }
   return null;
};

// @desc    Renderizar la página de inicio
// @route   GET /
// @access  Public
const renderHomePage = asyncHandler(async (req, res) => {
   res.render('index', { title: 'Inicio - Portal Educativo', body: '' });
});

// @desc    Renderizar la página "Acerca de"
// @route   GET /about
// @access  Public
const renderAboutPage = asyncHandler(async (req, res) => {
   res.render('about', { title: 'Acerca de - Portal Educativo', body: '' });
});

// @desc    Renderizar la página de contacto
// @route   GET /contact
// @access  Public
const renderContactPage = asyncHandler(async (req, res) => {
   res.render('contact', { title: 'Contacto - Portal Educativo', body: '' });
});

// @desc    Renderizar la página para agregar una materia
// @route   GET /admin/subjects/add
// @access  Private/Admin
const renderAddSubjectPage = asyncHandler(async (req, res) => {
   res.render('subjects/addSubject', { title: 'Agregar Materia', body: '', message: null });
});

// @desc    Procesar el formulario para agregar una materia
// @route   POST /admin/subjects/add
// @access  Private/Admin
const addSubject = asyncHandler(async (req, res) => {
   const validationErrorResponse = handleViewValidationErrors(req, res, 'subjects/addSubject', { title: 'Agregar Materia' });
   if (validationErrorResponse) return validationErrorResponse;

   const { name, description } = req.body;

   try {
       await SubjectService.createSubject({ name, description });
       res.redirect('/admin/subjects');
   } catch (error) {
       console.error(error);
       res.render('subjects/addSubject', { title: 'Agregar Materia', body: '', message: error.message });
   }
});

// @desc    Renderizar la página para editar una materia
// @route   GET /admin/subjects/edit/:id
// @access  Private/Admin
const renderEditSubjectPage = asyncHandler(async (req, res) => {
   const validationErrorResponse = handleViewValidationErrors(req, res, 'subjects/editSubject', { title: 'Editar Materia' });
   if (validationErrorResponse) return validationErrorResponse;

   try {
       const subject = await SubjectService.getSubjectById(req.params.id);
       res.render('subjects/editSubject', { title: 'Editar Materia', body: '', subject, message: null });
   } catch (error) {
       console.error(error);
       res.status(404).render('subjects/editSubject', { title: 'Editar Materia', body: '', subject: null, message: error.message });
   }
});

// @desc    Procesar el formulario para actualizar una materia
// @route   POST /admin/subjects/edit/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
   const validationErrorResponse = handleViewValidationErrors(req, res, 'subjects/editSubject', { title: 'Modificar Materia', subject: req.body }); // Pasa req.body para rellenar el formulario en caso de error
   if (validationErrorResponse) return validationErrorResponse;

   const { name, description } = req.body;
   try {
       await SubjectService.updateSubject(req.params.id, { name, description });
       res.redirect('/admin/subjects');
   } catch (error) {
       console.error(error);
       res.render('subjects/editSubject', { title: 'Modificar Materia', body: '', subject: { _id: req.params.id, name, description }, message: error.message });
   }
});

// @desc    Renderizar la página para mostrar todas las materias
// @route   GET /admin/subjects
// @access  Private/Admin
const renderListSubjectsPage = asyncHandler(async (req, res) => {
   const subjects = await SubjectService.getSubjects();
   res.render('subjects/listSubjects', { title: 'Listado de Materias', body: '', subjects });
});

// @desc    Eliminar una materia
// @route   POST /admin/subjects/delete/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
   const validationErrorResponse = handleViewValidationErrors(req, res, 'subjects/listSubjects', { title: 'Listado de Materias' }); // No hay formulario para delete, pero para consistencia
   if (validationErrorResponse) return validationErrorResponse;

   try {
       await SubjectService.deleteSubject(req.params.id);
       res.redirect('/admin/subjects');
   } catch (error) {
       console.error(error);
       res.redirect('/admin/subjects'); // Redirigir con posible mensaje de error si se implementa
   }
});

export {
   renderHomePage,
   renderAboutPage,
   renderContactPage,
   renderAddSubjectPage,
   addSubject,
   renderEditSubjectPage,
   updateSubject,
   renderListSubjectsPage,
   deleteSubject
};
