import API from './axiosConfig';

const facultadService = {
 getFacultades: async () => {
   const response = await API.get('/facultades');
   return response.data;
 },

 getFacultadById: async (id) => {
   const response = await API.get(`/facultades/${id}`);
   return response.data;
 },

 createFacultad: async (facultadData) => {
   const response = await API.post('/facultades', facultadData);
   return response.data;
 },

 updateFacultad: async (id, facultadData) => {
   const response = await API.put(`/facultades/${id}`, facultadData);
   return response.data;
 },

 deleteFacultad: async (id) => {
   const response = await API.delete(`/facultades/${id}`);
   return response.data;
 }
};

export default facultadService;
