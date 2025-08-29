import API from './axiosConfig';

const forumService = {
 getForumPosts: async () => {
   const response = await API.get('/forumposts');
   return response.data;
 },

 getForumPostById: async (id) => {
   const response = await API.get(`/forumposts/${id}`);
   return response.data;
 },

 createForumPost: async (postData) => {
   const response = await API.post('/forumposts', postData);
   return response.data;
 },

 updateForumPost: async (id, postData) => {
   const response = await API.put(`/forumposts/${id}`, postData);
   return response.data;
 },

 deleteForumPost: async (id) => {
   const response = await API.delete(`/forumposts/${id}`);
   return response.data;
 },

 approveForumPost: async (id, isApproved) => {
   const response = await API.put(`/forumposts/${id}/approve`, { isApproved });
   return response.data;
 }
};

export default forumService;
