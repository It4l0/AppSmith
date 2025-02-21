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
      // Remover campos vazios ou undefined
      const dadosParaEnviar = Object.entries(usuario).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          if (key === 'sistemas') {
            acc[key] = value.map(s => s.id);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      const response = await api.post('/users', dadosParaEnviar);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  atualizarUsuario: async (id, usuario) => {
    try {
      // Remover campos vazios ou undefined
      const dadosParaEnviar = Object.entries(usuario).reduce((acc, [key, value]) => {
        if (key === 'senha' && !value) {
          return acc; // Não envia senha se estiver vazia
        }
        if (value !== '' && value !== undefined && value !== null) {
          if (key === 'sistemas') {
            acc[key] = value.map(s => s.id);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      const response = await api.put(`/users/${id}`, dadosParaEnviar);
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
