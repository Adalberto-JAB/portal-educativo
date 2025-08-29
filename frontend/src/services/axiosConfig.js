import axios from 'axios';
import { toast } from 'react-toastify';

// Crear una instancia de Axios
const API = axios.create({
 baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api', // URL base de tu backend
 headers: {
   'Content-Type': 'application/json',
 },
});

// Interceptor de solicitudes: Añadir el token JWT a cada petición
API.interceptors.request.use(
 (config) => {
   try {
     const user = JSON.parse(localStorage.getItem('user'));
     const token = user?.token;

     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
   } catch (error) {
     console.error('Error reading user from localStorage in interceptor:', error);
     // No hacer nada y permitir que la solicitud continúe sin token
   }
   return config;
 },
 (error) => {
   return Promise.reject(error);
 }
);

// Interceptor de respuestas: Manejo básico de errores
API.interceptors.response.use(
 (response) => {
   return response;
 },
 (error) => {
   const originalRequest = error.config;

   // Si la respuesta es un error y no es la solicitud de login/register
   if (error.response) {
     const { status, data } = error.response;

     // Manejo de token expirado o no autorizado (401)
     if (status === 401 && !originalRequest._retry) {
       originalRequest._retry = true; // Marcar para evitar bucles infinitos
       // Aquí podrías intentar refrescar el token si tienes esa lógica
       // Por ahora, simplemente redirigimos a login y limpiamos el localStorage
       toast.error('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
       localStorage.removeItem('user');
       localStorage.removeItem('isAuthenticated');
       // Redirigir al login
       window.location.href = '/login'; // Usar window.location.href para una recarga completa
       return Promise.reject(error);
     }

     // Manejo de acceso denegado (403)
     if (status === 403) {
       toast.error(data.message || 'No tienes permiso para realizar esta acción.');
       // Opcional: Redirigir a una página de "Acceso Denegado"
       return Promise.reject(error);
     }

     // Otros errores del servidor (400, 500, etc.)
     if (data && data.message) {
       toast.error(data.message);
     } else if (error.message) {
       toast.error(`Error de red o del servidor: ${error.message}`);
     }
   } else {
     // Errores que no son de respuesta HTTP (ej. red, CORS)
     toast.error('Error de conexión con el servidor. Por favor, verifica tu conexión a internet.');
   }

   return Promise.reject(error);
 }
);

export default API;
