import API from './axiosConfig';

const authService = {
 login: async (email, password) => {
   const response = await API.post('/auth/login', { email, password });
   return response.data;
 },

 register: async (userData) => {
   const response = await API.post('/auth/register', userData);
   return response.data;
 },

 getMe: async () => {
   const response = await API.get('/users/me');
   return response.data;
 },

 // No hay una API de logout en el backend, el logout es limpiar el token en el frontend
 // Pero lo mantenemos aquí para consistencia si se necesitara una llamada al backend en el futuro
 logout: () => {
   // Aquí no se hace una llamada a la API, la lógica de logout es local
   // Puedes limpiar cualquier estado de sesión o token aquí si no lo haces en AuthContext
 }
};

export default authService;
