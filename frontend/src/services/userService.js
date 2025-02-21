import api from './api';

const userService = {
  listarUsuarios: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarUsuarioPorId: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  criarUsuario: async (usuario) => {
    try {
      const response = await api.post('/users', usuario);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  atualizarUsuario: async (id, usuario) => {
    try {
      const response = await api.put(`/users/${id}`, usuario);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  excluirUsuario: async (id) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default userService;
