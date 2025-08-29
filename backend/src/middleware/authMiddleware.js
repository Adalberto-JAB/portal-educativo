import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // Para manejar errores asíncronos
import User from '../models/User.js'; // Importa el modelo de usuario (necesitarás crearlo en la Parte 2)

// Middleware para proteger rutas (verificar JWT)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token está en las cabeceras de autorización (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token de la cabecera
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario por el ID decodificado y adjuntarlo a la solicitud (sin la contraseña)
      // Nota: El modelo User debe tener un método o hook para seleccionar campos.
      // Por ahora, asumimos que User.findById() funciona.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401); // No autorizado si el usuario no se encuentra
        throw new Error('Usuario no encontrado o token inválido');
      }

      next(); // Continuar con la siguiente función de middleware/ruta
    } catch (error) {
      console.error(error);
      res.status(401); // No autorizado
      throw new Error('Token fallido, no autorizado');
    }
  }

  if (!token) {
    res.status(401); // No autorizado
    throw new Error('No hay token, no autorizado');
  }
});

// Middleware para verificar roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user ya debe estar disponible aquí gracias al middleware 'protect'
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Prohibido
      throw new Error('No tienes permiso para acceder a esta ruta');
    }
    next();
  };
};

const getAuthUser = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Invalid token, but we don't want to block the request
      // We just won't have a req.user
      console.error('Invalid token found, proceeding as guest.');
    }
  }
  next();
});

export { protect, authorizeRoles, getAuthUser };
