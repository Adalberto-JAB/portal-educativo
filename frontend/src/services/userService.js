import API from './axiosConfig';

const userService = {
 getUsers: async (role = '') => {
   const response = await API.get(`/users${role ? `?role=${role}` : ''}`);
   return response.data;
 },

 getUserById: async (id) => {
   const response = await API.get(`/users/${id}`);
   return response.data;
 },

 updateUser: async (id, userData) => {
   const response = await API.put(`/users/${id}`, userData);
   return response.data;
 },

 deleteUser: async (id) => {
   const response = await API.delete(`/users/${id}`);
   return response.data;
 },

 changePassword: async (passwordData) => {
   const response = await API.put('/users/change-password', passwordData);
   return response.data;
 }
};

export default userService;
