import API from './axiosConfig';

const nivelService = {
 getNiveles: async () => {
   const response = await API.get('/niveles');
   return response.data;
 },

 getNivelById: async (id) => {
   const response = await API.get(`/niveles/${id}`);
   return response.data;
 },

 createNivel: async (nivelData) => {
   const response = await API.post('/niveles', nivelData);
   return response.data;
 },

 updateNivel: async (id, nivelData) => {
   const response = await API.put(`/niveles/${id}`, nivelData);
   return response.data;
 },

 deleteNivel: async (id) => {
   const response = await API.delete(`/niveles/${id}`);
   return response.data;
 }
};

export default nivelService;
