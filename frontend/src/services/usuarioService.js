import api from './api';
import LogService from './logService';

const handleApiError = (error, operacao) => {
  if (error.code === 'ECONNABORTED') {
    throw {
      ...error,
      message: `Tempo limite excedido ao ${operacao}. Tente novamente.`
    };
  } else if (!error.response) {
    throw {
      ...error,
      message: `Erro de conexão ao ${operacao}. Verifique se o servidor está rodando.`
    };
  } else {
    throw {
      ...error,
      message: error.response.data?.message || `Erro ao ${operacao}. Status: ${error.response.status}`
    };
  }
};

const formatarUsuario = (usuario) => ({
  id: usuario.id,
  nome: usuario.nome || '',
  email: usuario.email || '',
  status: usuario.status || 'ativo',
  tipo: usuario.tipo || 'usuario',
  cargo: usuario.cargo || 'usuario',
  departamento: usuario.departamento || '',
  createdAt: usuario.createdAt,
  updatedAt: usuario.updatedAt
});

const usuarioService = {
  // Listar todos os usuários
  listarUsuarios: async () => {
    try {
      LogService.info('[USUARIOS] Iniciando requisição para listar usuários');
      const response = await api.get('/usuarios');
      LogService.info(`[USUARIOS] ${response.data.length} usuários recebidos`);
      return response.data.map(formatarUsuario);
    } catch (error) {
      LogService.error('[USUARIOS] Erro ao listar usuários:', error);
      throw handleApiError(error, 'listar usuários');
    }
  },

  // Buscar usuário por ID
  buscarUsuarioPorId: async (id) => {
    try {
      LogService.info(`[USUARIOS] Iniciando busca do usuário ${id}`);
      const response = await api.get(`/usuarios/${id}`);
      LogService.info(`[USUARIOS] Usuário ${id} recebido com sucesso`);
      return formatarUsuario(response.data);
    } catch (error) {
      LogService.error(`[USUARIOS] Erro ao buscar usuário ${id}:`, error);
      throw handleApiError(error, 'buscar usuário');
    }
  },

  // Criar novo usuário
  criarUsuario: async (usuario) => {
    try {
      LogService.info('[USUARIOS] Iniciando criação de usuário');
      const response = await api.post('/usuarios', usuario);
      LogService.info(`[USUARIOS] Usuário criado com sucesso: ${response.data.id}`);
      return formatarUsuario(response.data);
    } catch (error) {
      LogService.error('[USUARIOS] Erro ao criar usuário:', error);
      throw handleApiError(error, 'criar usuário');
    }
  },

  // Atualizar usuário
  atualizarUsuario: async (id, usuario) => {
    try {
      LogService.info(`[USUARIOS] Iniciando atualização do usuário ${id}`);
      const response = await api.put(`/usuarios/${id}`, usuario);
      LogService.info(`[USUARIOS] Usuário ${id} atualizado com sucesso`);
      return formatarUsuario(response.data);
    } catch (error) {
      LogService.error(`[USUARIOS] Erro ao atualizar usuário ${id}:`, error);
      throw handleApiError(error, 'atualizar usuário');
    }
  },

  // Excluir usuário
  excluirUsuario: async (id) => {
    try {
      LogService.info(`[USUARIOS] Iniciando exclusão do usuário ${id}`);
      await api.delete(`/usuarios/${id}`);
      LogService.info(`[USUARIOS] Usuário ${id} excluído com sucesso`);
    } catch (error) {
      LogService.error(`[USUARIOS] Erro ao excluir usuário ${id}:`, error);
      throw handleApiError(error, 'excluir usuário');
    }
  }
};

export default usuarioService;
