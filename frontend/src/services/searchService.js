import API from './axiosConfig';

const searchService = {
 // Este servicio contendrá funciones para realizar búsquedas en la aplicación
 searchAll: async (query) => {
   // Simulación de resultados de búsqueda
   const response = await new Promise(resolve => setTimeout(() => {
     resolve({
       courses: [{ id: 'c1', title: `Curso sobre ${query}` }],
       documentation: [{ id: 'd1', title: `Documento sobre ${query}` }],
       forumPosts: [{ id: 'f1', title: `Foro: Pregunta sobre ${query}` }],
     });
   }, 700));
   return response;
   // En una aplicación real:
   // const response = await API.get(`/search?q=${query}`);
   // return response.data;
 },

 searchCourses: async (query) => {
   const response = await API.get(`/courses?search=${query}`); // Asumiendo que la API de cursos soporta búsqueda
   return response.data;
 },

 searchDocumentation: async (query) => {
   const response = await API.get(`/documentation?search=${query}`); // Asumiendo que la API de doc soporta búsqueda
   return response.data;
 }
};

export default searchService;
