import API from './axiosConfig';

const profilePictureService = {
 getProfilePictureById: async (id) => {
   // Para obtener la imagen, la API devuelve el buffer directamente
   const response = await API.get(`/profilepictures/${id}`, { responseType: 'blob' });
   return response.data; // Esto será un Blob
 },

 createProfilePicture: async (formData) => { // formData debe contener la imagen
   const response = await API.post('/profilepictures', formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
   return response.data;
 },

 updateProfilePicture: async (id, formData) => { // formData puede contener la imagen
   const response = await API.put(`/profilepictures/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
   return response.data;
 },

 deleteProfilePicture: async (id) => {
   const response = await API.delete(`/profilepictures/${id}`);
   return response.data;
 }
};

export default profilePictureService;
