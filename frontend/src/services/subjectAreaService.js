import api from './axiosConfig';

export const getAllSubjectAreas = async () => {
  const response = await api.get('/subject-areas');
  return response.data;
};

export const getSubjectAreaById = async (id) => {
  const response = await api.get(`/subject-areas/${id}`);
  return response.data;
};

export const createSubjectArea = async (data) => {
  const response = await api.post('/subject-areas', data);
  return response.data;
};

export const updateSubjectArea = async (id, data) => {
  const response = await api.put(`/subject-areas/${id}`, data);
  return response.data;
};

export const deleteSubjectArea = async (id) => {
  const response = await api.delete(`/subject-areas/${id}`);
  return response.data;
};
