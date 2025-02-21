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

const formatarSistema = (sistema) => ({
  id: sistema.id,
  nome: sistema.nome || '',
  descricao: sistema.descricao || '',
  url: sistema.url || '',
  status: sistema.status || 'ativo',
  versao: sistema.versao || '',
  responsavel: sistema.responsavel || '',
  observacoes: sistema.observacoes || '',
  createdAt: sistema.createdAt,
  updatedAt: sistema.updatedAt
});

const sistemaService = {
  // Listar todos os sistemas
  listarSistemas: async () => {
    try {
      LogService.info('[SISTEMAS] Iniciando requisição para listar sistemas');
      const response = await api.get('/sistemas');
      LogService.info(`[SISTEMAS] ${response.data.length} sistemas recebidos`);
      return response.data.map(formatarSistema);
    } catch (error) {
      LogService.error('[SISTEMAS] Erro ao listar sistemas:', error);
      throw handleApiError(error, 'listar sistemas');
    }
  },

  // Buscar sistema por ID
  buscarSistemaPorId: async (id) => {
    try {
      LogService.info(`[SISTEMAS] Iniciando busca do sistema ${id}`);
      const response = await api.get(`/sistemas/${id}`);
      LogService.info(`[SISTEMAS] Sistema ${id} recebido com sucesso`);
      return formatarSistema(response.data);
    } catch (error) {
      LogService.error(`[SISTEMAS] Erro ao buscar sistema ${id}:`, error);
      throw handleApiError(error, 'buscar sistema');
    }
  },

  // Criar novo sistema
  criarSistema: async (sistema) => {
    try {
      LogService.info('[SISTEMAS] Iniciando criação de sistema');
      const response = await api.post('/sistemas', sistema);
      LogService.info(`[SISTEMAS] Sistema criado com sucesso: ${response.data.id}`);
      return formatarSistema(response.data);
    } catch (error) {
      LogService.error('[SISTEMAS] Erro ao criar sistema:', error);
      throw handleApiError(error, 'criar sistema');
    }
  },

  // Atualizar sistema
  atualizarSistema: async (id, sistema) => {
    try {
      LogService.info(`[SISTEMAS] Iniciando atualização do sistema ${id}`);
      const response = await api.put(`/sistemas/${id}`, sistema);
      LogService.info(`[SISTEMAS] Sistema ${id} atualizado com sucesso`);
      return formatarSistema(response.data);
    } catch (error) {
      LogService.error(`[SISTEMAS] Erro ao atualizar sistema ${id}:`, error);
      throw handleApiError(error, 'atualizar sistema');
    }
  },

  // Excluir sistema
  excluirSistema: async (id) => {
    try {
      LogService.info(`[SISTEMAS] Iniciando exclusão do sistema ${id}`);
      await api.delete(`/sistemas/${id}`);
      LogService.info(`[SISTEMAS] Sistema ${id} excluído com sucesso`);
    } catch (error) {
      LogService.error(`[SISTEMAS] Erro ao excluir sistema ${id}:`, error);
      throw handleApiError(error, 'excluir sistema');
    }
  }
};

export default sistemaService;
