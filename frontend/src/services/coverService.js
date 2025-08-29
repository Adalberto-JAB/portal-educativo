import API from './axiosConfig';

const coverService = {
 getCovers: async () => {
   const response = await API.get('/covers');
   return response.data;
 },

  getCoverById: async (id) => {
   // Para obtener la imagen, la API devuelve el buffer directamente
   // Asegúrate de que tu backend sirva la imagen directamente desde esta ruta
   const response = await API.get(`/covers/${id}`, { responseType: 'blob' });
   return response.data; // Esto será un Blob
 },

 getCoverDataUrl: async (id) => {
   const response = await API.get(`/covers/${id}`); // No responseType: 'blob'
   return response.data; // This will be the JSON object { dataUrl, contentType }
 },

 createCover: async (formData) => { // formData debe contener la imagen
   const response = await API.post('/covers', formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
   return response.data;
 },

 updateCover: async (id, formData) => { // formData puede contener la imagen
   const response = await API.put(`/covers/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
   return response.data;
 },

 deleteCover: async (id) => {
   const response = await API.delete(`/covers/${id}`);
   return response.data;
 }
};

export default coverService;
