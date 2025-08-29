import API from './axiosConfig';

const enrollmentService = {
  getEnrollments: async (userId = '', courseId = '') => {
    let query = '';
    if (userId) query += `userId=${userId}`;
    if (courseId) query += `${query ? '&' : ''}courseId=${courseId}`;

    const response = await API.get(`/enrollments${query ? `?${query}` : ''}`);
    return response.data;
  },

  getEnrollmentById: async (id) => {
    const response = await API.get(`/enrollments/${id}`);
    return response.data;
  },

  checkEnrollmentStatus: async (courseId) => {
    const response = await API.get(`/enrollments/status/${courseId}`);
    return response.data;
  },

  enrollUser: async (enrollmentData) => {
    const response = await API.post('/enrollments', enrollmentData);
    return response.data;
  },

  updateEnrollment: async (id, enrollmentData) => {
    const response = await API.put(`/enrollments/${id}`, enrollmentData);
    return response.data;
  },

  deleteEnrollment: async (id) => {
    const response = await API.delete(`/enrollments/${id}`);
    return response.data;
  }
};

export default enrollmentService;