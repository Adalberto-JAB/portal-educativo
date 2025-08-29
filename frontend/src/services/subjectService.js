import API from './axiosConfig';

const subjectService = {
 getSubjects: async () => {
   const response = await API.get('/subjects');
   return response.data;
 },

 getSubjectById: async (id) => {
   const response = await API.get(`/subjects/${id}`);
   return response.data;
 },

 createSubject: async (subjectData) => {
   const response = await API.post('/subjects', subjectData);
   return response.data;
 },

 updateSubject: async (id, subjectData) => {
   const response = await API.put(`/subjects/${id}`, subjectData);
   return response.data;
 },

 deleteSubject: async (id) => {
   const response = await API.delete(`/subjects/${id}`);
   return response.data;
 }
};

export default subjectService;
