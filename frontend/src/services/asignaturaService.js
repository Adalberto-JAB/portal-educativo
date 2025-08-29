import api from './axiosConfig';

const API_URL = '/asignaturas';

const asignaturaService = {
    getAllAsignaturas: async () => {
        const response = await api.get(API_URL);
        return response.data;
    },

    getAsignaturaById: async (id) => {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    },

    createAsignatura: async (asignaturaData) => {
        const response = await api.post(API_URL, asignaturaData);
        return response.data;
    },

    updateAsignatura: async (id, asignaturaData) => {
        const response = await api.put(`${API_URL}/${id}`, asignaturaData);
        return response.data;
    },

    deleteAsignatura: async (id) => {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    },

    getAsignaturasByCarrera: async (carreraId) => {
        const response = await api.get(`${API_URL}/carrera/${carreraId}`);
        return response.data;
    }
};

export default asignaturaService;
