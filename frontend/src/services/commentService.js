import API from './axiosConfig';

const commentService = {
 getComments: async (forumPostId = '') => {
   const response = await API.get(`/comments${forumPostId ? `?forumPostId=${forumPostId}` : ''}`);
   return response.data;
 },

 getCommentById: async (id) => {
   const response = await API.get(`/comments/${id}`);
   return response.data;
 },

 createComment: async (commentData) => {
   const response = await API.post('/comments', commentData);
   return response.data;
 },

 updateComment: async (id, commentData) => {
   const response = await API.put(`/comments/${id}`, commentData);
   return response.data;
 },

 deleteComment: async (id) => {
   const response = await API.delete(`/comments/${id}`);
   return response.data;
 },

 approveComment: async (id, isApproved) => {
   const response = await API.put(`/comments/${id}/approve`, { isApproved });
   return response.data;
 }
};

export default commentService;
