import api from './api';

const systemService = {
  listSystems: async () => {
    const response = await api.get('/systems');
    return response.data;
  },

  getSystem: async (id) => {
    const response = await api.get(`/systems/${id}`);
    return response.data;
  },

  createSystem: async (systemData) => {
    const response = await api.post('/systems', systemData);
    return response.data;
  },

  updateSystem: async (id, systemData) => {
    const response = await api.put(`/systems/${id}`, systemData);
    return response.data;
  },

  deleteSystem: async (id) => {
    const response = await api.delete(`/systems/${id}`);
    return response.data;
  },

  updateSystemStatus: async (id, status) => {
    const response = await api.patch(`/systems/${id}/status`, { status });
    return response.data;
  }
};

export default systemService;
