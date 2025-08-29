import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import UserService from '../services/UserService.js'; // Importar el servicio

// Función auxiliar para manejar errores de validación
const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const { name, last_name, email, password, role, address, phoneNumber, profilePictureURL } = req.body;

   const user = await UserService.registerUser({ name, last_name, email, password, role, address, phoneNumber, profilePictureURL });
   res.status(201).json(user);
});

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const { email, password } = req.body;

   const user = await UserService.loginUser(email, password);
   res.json(user);
});

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
   const users = await UserService.getUsers();
   res.json(users);
});

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin o el propio usuario
const getUserById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const user = await UserService.getUserById(req.params.id);
   // Control de autorización en el controlador ya que depende del usuario autenticado
   if (req.user.role === 'admin' || req.user._id.toString() === user._id.toString()) {
       res.json(user);
   } else {
       res.status(403);
       throw new Error('No autorizado para acceder a este perfil.');
   }
});

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private/Admin o el propio usuario
const updateUser = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const updatedUser = await UserService.updateUser(req.params.id, req.body, req.user);
   res.json(updatedUser);
});

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res); // Manejar errores de validación

   const message = await UserService.deleteUser(req.params.id);
   res.json(message);
});

// @desc    Obtener el perfil del usuario autenticado
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
   const user = await UserService.getMe(req.user._id);
   res.json(user);
});

// @desc    Cambiar la contraseña del usuario autenticado
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    handleValidationErrors(req, res);

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const message = await UserService.changePassword(userId, currentPassword, newPassword);
    res.json(message);
});

export {
   registerUser,
   loginUser,
   getUsers,
   getUserById,
   updateUser,
   deleteUser,
   getMe,
   changePassword
};
