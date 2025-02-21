const System = require('../models/system');

const systemController = {
  // Listar todos os sistemas
  list: async (req, res) => {
    try {
      const systems = await System.findAll();
      res.json(systems);
    } catch (error) {
      console.error('Erro ao listar sistemas:', error);
      res.status(500).json({ message: 'Erro ao listar sistemas' });
    }
  },

  // Buscar sistema por ID
  getById: async (req, res) => {
    try {
      const system = await System.findByPk(req.params.id);
      if (!system) {
        return res.status(404).json({ message: 'Sistema não encontrado' });
      }
      res.json(system);
    } catch (error) {
      console.error('Erro ao buscar sistema:', error);
      res.status(500).json({ message: 'Erro ao buscar sistema' });
    }
  },

  // Criar novo sistema
  create: async (req, res) => {
    try {
      const system = await System.create(req.body);
      res.status(201).json(system);
    } catch (error) {
      console.error('Erro ao criar sistema:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          message: 'Erro de validação', 
          errors: error.errors.map(e => e.message) 
        });
      }
      res.status(500).json({ message: 'Erro ao criar sistema' });
    }
  },

  // Atualizar sistema
  update: async (req, res) => {
    try {
      const system = await System.findByPk(req.params.id);
      if (!system) {
        return res.status(404).json({ message: 'Sistema não encontrado' });
      }
      await system.update(req.body);
      res.json(system);
    } catch (error) {
      console.error('Erro ao atualizar sistema:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          message: 'Erro de validação', 
          errors: error.errors.map(e => e.message) 
        });
      }
      res.status(500).json({ message: 'Erro ao atualizar sistema' });
    }
  },

  // Excluir sistema
  delete: async (req, res) => {
    try {
      const system = await System.findByPk(req.params.id);
      if (!system) {
        return res.status(404).json({ message: 'Sistema não encontrado' });
      }
      await system.destroy();
      res.json({ message: 'Sistema excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir sistema:', error);
      res.status(500).json({ message: 'Erro ao excluir sistema' });
    }
  },

  // Atualizar status do sistema
  updateStatus: async (req, res) => {
    try {
      const system = await System.findByPk(req.params.id);
      if (!system) {
        return res.status(404).json({ message: 'Sistema não encontrado' });
      }

      const { status } = req.body;
      if (!['ativo', 'inativo', 'manutencao'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido' });
      }

      await system.update({ status });
      res.json(system);
    } catch (error) {
      console.error('Erro ao atualizar status do sistema:', error);
      res.status(500).json({ message: 'Erro ao atualizar status do sistema' });
    }
  }
};

module.exports = systemController;
