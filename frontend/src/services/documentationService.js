import api from './axiosConfig';

const documentationService = {
    create: async (formData) => {
        const response = await api.post('/documentation', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/documentation');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/documentation/${id}`);
        return response.data;
    },
    update: async (id, formData) => {
        const response = await api.put(`/documentation/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    remove: async (id) => {
        const response = await api.delete(`/documentation/${id}`);
        return response.data;
    },
    publish: async (id) => {
        const response = await api.put(`/documentation/${id}/publish`);
        return response.data;
    },
    unpublish: async (id) => {
        const response = await api.put(`/documentation/${id}/unpublish`);
        return response.data;
    },
    toggleGuestViewable: async (id) => {
        const response = await api.put(`/documentation/${id}/toggle-guest`);
        return response.data;
    },
    getFileContent: async (id) => {
        const response = await api.get(`/documentation/${id}/content`, {
            responseType: 'blob' // Important for file downloads
        });
        return response.data;
    },
};

export default documentationService;
