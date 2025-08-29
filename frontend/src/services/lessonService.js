import API from './axiosConfig';

const lessonService = {
 getLessons: async (courseId = '') => {
   const response = await API.get(`/lessons${courseId ? `?courseId=${courseId}` : ''}`);
   return response.data;
 },

 getLessonById: async (id) => {
   const response = await API.get(`/lessons/${id}`);
   return response.data;
 },

 getLessonPdf: async (id) => {
   const response = await API.get(`/lessons/${id}/pdf`, {
     responseType: 'blob', // Important for handling binary file data
   });
   return response.data;
 },

 createLesson: async (formData) => {
   const response = await API.post('/lessons', formData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   return response.data;
 },

 updateLesson: async (id, formData) => {
   const response = await API.put(`/lessons/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   return response.data;
 },

 deleteLesson: async (id) => {
   const response = await API.delete(`/lessons/${id}`);
   return response.data;
 }
};

export default lessonService;
