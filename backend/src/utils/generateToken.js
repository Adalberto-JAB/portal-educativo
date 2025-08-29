import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno

/**
 * Genera un JSON Web Token (JWT) para un usuario.
 * @param {string} id - El ID del usuario.
 * @param {string} role - El rol del usuario.
 * @returns {string} El JWT generado.
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // Tiempo de expiración del token
  });
};

export default generateToken;
