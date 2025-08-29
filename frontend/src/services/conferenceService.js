import API from './axiosConfig';

const conferenceService = {
 getConferences: async () => {
   const response = await API.get('/conferences');
   return response.data;
 },

 getConferenceById: async (id) => {
   const response = await API.get(`/conferences/${id}`);
   return response.data;
 },

 createConference: async (conferenceData) => {
   // Se envían los datos como JSON, el Content-Type por defecto de axiosConfig es application/json
   const response = await API.post('/conferences', conferenceData);
   return response.data;
 },

 updateConference: async (id, conferenceData) => {
   // Se envían los datos como JSON
   const response = await API.put(`/conferences/${id}`, conferenceData);
   return response.data;
 },

 deleteConference: async (id) => {
   const response = await API.delete(`/conferences/${id}`);
   return response.data;
 },

 approveConference: async (id, isApproved) => {
   const response = await API.put(`/conferences/${id}/approve`, { isApproved });
   return response.data;
 }
};

export default conferenceService;
