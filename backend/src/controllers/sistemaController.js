const Sistema = require('../models/sistema');

// Listar todos os sistemas
exports.listar = async (req, res) => {
  try {
    console.log('[SISTEMAS] Iniciando listagem de sistemas');
    const sistemas = await Sistema.findAll({
      attributes: ['id', 'nome', 'descricao', 'url', 'status', 'versao', 'responsavel', 'observacoes', 'createdAt', 'updatedAt'],
      order: [['nome', 'ASC']]
    });
    
    console.log(`[SISTEMAS] ${sistemas.length} sistemas encontrados`);
    console.log('[SISTEMAS] Sistemas:', sistemas.map(s => ({ id: s.id, nome: s.nome })));
    
    // Formatando a resposta
    const response = sistemas.map(sistema => ({
      id: sistema.id,
      nome: sistema.nome,
      descricao: sistema.descricao,
      url: sistema.url,
      status: sistema.status,
      versao: sistema.versao,
      responsavel: sistema.responsavel,
      observacoes: sistema.observacoes,
      createdAt: sistema.createdAt,
      updatedAt: sistema.updatedAt
    }));
    
    res.json(response);
  } catch (error) {
    console.error('[SISTEMAS] Erro ao listar sistemas:', error);
    res.status(500).json({
      error: 'Erro ao listar sistemas',
      message: 'Ocorreu um erro ao buscar a lista de sistemas.'
    });
  }
};

// Buscar um sistema por ID
exports.buscarPorId = async (req, res) => {
  try {
    console.log(`[SISTEMAS] Buscando sistema por ID: ${req.params.id}`);
    const sistema = await Sistema.findByPk(req.params.id);
    
    if (!sistema) {
      console.log(`[SISTEMAS] Sistema não encontrado: ${req.params.id}`);
      return res.status(404).json({
        error: 'Sistema não encontrado',
        message: 'O sistema solicitado não foi encontrado.'
      });
    }
    
    console.log(`[SISTEMAS] Sistema encontrado: ${sistema.id} - ${sistema.nome}`);
    res.json({
      id: sistema.id,
      nome: sistema.nome,
      descricao: sistema.descricao,
      url: sistema.url,
      status: sistema.status,
      versao: sistema.versao,
      responsavel: sistema.responsavel,
      observacoes: sistema.observacoes,
      createdAt: sistema.createdAt,
      updatedAt: sistema.updatedAt
    });
  } catch (error) {
    console.error('[SISTEMAS] Erro ao buscar sistema:', error);
    res.status(500).json({
      error: 'Erro ao buscar sistema',
      message: 'Ocorreu um erro ao buscar o sistema.'
    });
  }
};

// Criar um novo sistema
exports.criar = async (req, res) => {
  try {
    console.log('[SISTEMAS] Criando novo sistema:', req.body);
    const sistema = await Sistema.create(req.body);
    console.log(`[SISTEMAS] Sistema criado com sucesso: ${sistema.id} - ${sistema.nome}`);
    res.status(201).json({
      id: sistema.id,
      nome: sistema.nome,
      descricao: sistema.descricao,
      url: sistema.url,
      status: sistema.status,
      versao: sistema.versao,
      responsavel: sistema.responsavel,
      observacoes: sistema.observacoes,
      createdAt: sistema.createdAt,
      updatedAt: sistema.updatedAt
    });
  } catch (error) {
    console.error('[SISTEMAS] Erro ao criar sistema:', error);
    res.status(500).json({
      error: 'Erro ao criar sistema',
      message: error.message || 'Ocorreu um erro ao criar o sistema.'
    });
  }
};

// Atualizar um sistema
exports.atualizar = async (req, res) => {
  try {
    console.log(`[SISTEMAS] Atualizando sistema ${req.params.id}:`, req.body);
    const sistema = await Sistema.findByPk(req.params.id);
    
    if (!sistema) {
      console.log(`[SISTEMAS] Sistema não encontrado: ${req.params.id}`);
      return res.status(404).json({
        error: 'Sistema não encontrado',
        message: 'O sistema que você está tentando atualizar não foi encontrado.'
      });
    }
    
    await sistema.update(req.body);
    console.log(`[SISTEMAS] Sistema atualizado com sucesso: ${sistema.id} - ${sistema.nome}`);
    
    res.json({
      id: sistema.id,
      nome: sistema.nome,
      descricao: sistema.descricao,
      url: sistema.url,
      status: sistema.status,
      versao: sistema.versao,
      responsavel: sistema.responsavel,
      observacoes: sistema.observacoes,
      createdAt: sistema.createdAt,
      updatedAt: sistema.updatedAt
    });
  } catch (error) {
    console.error('[SISTEMAS] Erro ao atualizar sistema:', error);
    res.status(500).json({
      error: 'Erro ao atualizar sistema',
      message: error.message || 'Ocorreu um erro ao atualizar o sistema.'
    });
  }
};

// Excluir um sistema
exports.excluir = async (req, res) => {
  try {
    console.log(`[SISTEMAS] Excluindo sistema ${req.params.id}`);
    const sistema = await Sistema.findByPk(req.params.id);
    
    if (!sistema) {
      console.log(`[SISTEMAS] Sistema não encontrado: ${req.params.id}`);
      return res.status(404).json({
        error: 'Sistema não encontrado',
        message: 'O sistema que você está tentando excluir não foi encontrado.'
      });
    }
    
    await sistema.destroy();
    console.log(`[SISTEMAS] Sistema excluído com sucesso: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    console.error('[SISTEMAS] Erro ao excluir sistema:', error);
    res.status(500).json({
      error: 'Erro ao excluir sistema',
      message: error.message || 'Ocorreu um erro ao excluir o sistema.'
    });
  }
};
