import API from './axiosConfig';

const carreraService = {
 getCarreras: async () => {
   const response = await API.get('/carreras');
   return response.data;
 },

 getCarreraById: async (id) => {
   const response = await API.get(`/carreras/${id}`);
   return response.data;
 },

 createCarrera: async (carreraData) => {
   const response = await API.post('/carreras', carreraData);
   return response.data;
 },

 updateCarrera: async (id, carreraData) => {
   const response = await API.put(`/carreras/${id}`, carreraData);
   return response.data;
 },

 deleteCarrera: async (id) => {
   const response = await API.delete(`/carreras/${id}`);
   return response.data;
 }
};

export default carreraService;
