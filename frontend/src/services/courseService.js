import API from './axiosConfig';

const courseService = {
 getCourses: async () => {
   const response = await API.get('/courses');
   return response.data;
 },

 getMyCourses: async () => {
    const response = await API.get('/courses/my-courses');
    return response.data;
 },

 getCourseById: async (id) => {
   const response = await API.get(`/courses/${id}`);
   return response.data;
 },

 createCourse: async (courseData) => {
   const response = await API.post('/courses', courseData);
   return response.data;
 },

 updateCourse: async (id, courseData) => {
   const response = await API.put(`/courses/${id}`, courseData);
   return response.data;
 },

 deleteCourse: async (id) => {
   const response = await API.delete(`/courses/${id}`);
   return response.data;
 }
};


export default courseService;
