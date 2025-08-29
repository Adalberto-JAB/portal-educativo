import API from './axiosConfig';

const dashboardService = {
 // Este servicio contendrá funciones para obtener datos específicos del dashboard
 // Por ejemplo:
 getDashboardSummary: async () => {
   // Simulación de datos del dashboard
   const response = await new Promise(resolve => setTimeout(() => {
     resolve({
       coursesEnrolled: 5,
       lessonsCompleted: 12,
       upcomingEvents: 2,
       unreadMessages: 3
     });
   }, 500));
   return response;
   // En una aplicación real:
   // const response = await API.get('/dashboard/summary');
   // return response.data;
 },

 getUserCoursesProgress: async (userId) => {
   // Simulación
   const response = await new Promise(resolve => setTimeout(() => {
     resolve([
       { courseName: 'Introducción a React', progress: 75 },
       { courseName: 'Fundamentos de JavaScript', progress: 90 },
     ]);
   }, 500));
   return response;
   // En una aplicación real:
   // const response = await API.get(`/dashboard/user/${userId}/courses-progress`);
   // return response.data;
 }
};

export default dashboardService;
