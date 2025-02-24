const User = require('../models/user');
const Sistema = require('../models/sistema');
const UsuarioSistema = require('../models/UsuarioSistema');
const Admin = require('../models/admin'); // Adicione essa linha
const sequelize = require('../config/database');

const userController = {
  // Listar todos os usuários
  list: async (req, res) => {
    try {
      console.log('\n[USERS] ====== INÍCIO DA LISTAGEM ======');
      console.log('[USERS] Headers:', req.headers);
      
      const users = await User.findAll({
        attributes: [
          'id',
          'nome',
          'email',
          'cpf',
          'telefone',
          'cargo',
          'departamento',
          'observacoes',
          'ativo'
        ],
        include: [{
          model: Sistema,
          as: 'sistemas',
          through: { attributes: [] }
        }],
        order: [['nome', 'ASC']]
      });

      console.log('[USERS] Dados retornados:', JSON.stringify(users, null, 2));
      console.log('[USERS] Total de usuários encontrados:', users.length);
      console.log('[USERS] ====== FIM DA LISTAGEM - SUCESSO ======\n');
      
      res.json(users);
    } catch (error) {
      console.error('\n[USERS] ====== ERRO NA LISTAGEM ======');
      console.error('[USERS] Tipo do erro:', error.name);
      console.error('[USERS] Mensagem:', error.message);
      console.error('[USERS] Stack:', error.stack);
      console.error('[USERS] ====== FIM DA LISTAGEM - ERRO ======\n');
      
      res.status(500).json({ 
        error: 'Erro ao listar usuários',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Buscar usuário por ID
  getById: async (req, res) => {
    try {
      console.log('\n[USERS] ====== INÍCIO DA BUSCA POR ID ======');
      console.log('[USERS] ID:', req.params.id);
      console.log('[USERS] Headers:', req.headers);
      
      const user = await User.findByPk(req.params.id, {
        attributes: { 
          exclude: ['senha'] // Mantém todos os campos exceto senha
        },
        include: [{
          model: Sistema,
          as: 'sistemas',
          through: { attributes: [] },
          attributes: ['id', 'nome','cpf','telefone','cargo','departamento','observacoes','status']
        }]
      });
      
      if (!user) {
        console.log('[USERS] Usuário não encontrado');
        console.log('[USERS] ====== FIM DA BUSCA - NÃO ENCONTRADO ======\n');
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      console.log('[USERS] Usuário encontrado:', user.nome);
      console.log('[USERS] ====== FIM DA BUSCA - SUCESSO ======\n');
      
      res.json(user);
    } catch (error) {
      console.error('\n[USERS] ====== ERRO NA BUSCA ======');
      console.error('[USERS] Tipo do erro:', error.name);
      console.error('[USERS] Mensagem:', error.message);
      console.error('[USERS] Stack:', error.stack);
      console.error('[USERS] ====== FIM DA BUSCA - ERRO ======\n');
      
      res.status(500).json({ 
        error: 'Erro ao buscar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Criar novo usuário
  create: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      console.log('\n[USERS] ====== INÍCIO DA CRIAÇÃO ======');
      console.log('[USERS] Dados recebidos:', req.body);
      
      const { sistemas, ...userData } = req.body;
      
      // Criar usuário
      const user = await User.create(userData, { transaction });
      console.log('[USERS] Usuário criado:', user.nome);

      // Associar sistemas se fornecidos
      if (Array.isArray(sistemas) && sistemas.length > 0) {
        console.log('[USERS] Sistemas a serem associados:', sistemas);
        await user.setSistemas(sistemas, { transaction });
        console.log('[USERS] Sistemas associados com sucesso');
      }

      await transaction.commit();
      
      // Buscar usuário com sistemas relacionados
      const userWithSystems = await User.findByPk(user.id, {
        attributes: { exclude: ['senha', 'createdAt', 'updatedAt'] },
        include: [{
          model: Sistema,
          as: 'sistemas',
          through: { attributes: [] }
        }]
      });

      console.log('[USERS] ====== FIM DA CRIAÇÃO - SUCESSO ======\n');
      res.status(201).json(userWithSystems);
    } catch (error) {
      await transaction.rollback();
      
      console.error('\n[USERS] ====== ERRO NA CRIAÇÃO ======');
      console.error('[USERS] Tipo do erro:', error.name);
      console.error('[USERS] Mensagem:', error.message);
      console.error('[USERS] Stack:', error.stack);
      console.error('[USERS] ====== FIM DA CRIAÇÃO - ERRO ======\n');
      
      res.status(400).json({ 
        error: 'Erro ao criar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Atualizar usuário
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      console.log('\n[USERS] ====== INÍCIO DA ATUALIZAÇÃO ======');
      console.log('[USERS] ID:', req.params.id);
      console.log('[USERS] Dados recebidos:', req.body);

      const { sistemas, ...userData } = req.body;
      
      // Verificar se usuário existe
      const user = await User.findByPk(req.params.id);
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Atualizar dados do usuário
      await user.update(userData, { transaction });
      console.log('[USERS] Dados básicos atualizados');

      // Atualizar sistemas se fornecidos
      if (Array.isArray(sistemas)) {
        console.log('[USERS] Atualizando sistemas:', sistemas);
        await user.setSistemas(sistemas, { transaction });
        console.log('[USERS] Sistemas atualizados com sucesso');
      }

      await transaction.commit();

      // Buscar usuário atualizado com sistemas
      const updatedUser = await User.findByPk(req.params.id, {
        attributes: { exclude: ['senha', 'createdAt', 'updatedAt'] },
        include: [{
          model: Sistema,
          as: 'sistemas',
          through: { attributes: [] }
        }]
      });

      console.log('[USERS] ====== FIM DA ATUALIZAÇÃO - SUCESSO ======\n');
      res.json(updatedUser);
    } catch (error) {
      await transaction.rollback();
      
      console.error('\n[USERS] ====== ERRO NA ATUALIZAÇÃO ======');
      console.error('[USERS] Tipo do erro:', error.name);
      console.error('[USERS] Mensagem:', error.message);
      console.error('[USERS] Stack:', error.stack);
      console.error('[USERS] ====== FIM DA ATUALIZAÇÃO - ERRO ======\n');
      
      res.status(400).json({ 
        error: 'Erro ao atualizar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Excluir usuário
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      console.log('\n[USERS] ====== INÍCIO DA EXCLUSÃO ======');
      console.log('[USERS] ID:', req.params.id);
      
      const user = await User.findByPk(req.params.id, { transaction });
      
      if (!user) {
        console.log('[USERS] Usuário não encontrado');
        console.log('[USERS] ====== FIM DA EXCLUSÃO - NÃO ENCONTRADO ======\n');
        await transaction.rollback();
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar se existem associações com Admin
      const admin = await Admin.findOne({ 
        where: { userId: req.params.id },
        transaction 
      });

      if (admin) {
        // Se for admin, primeiro remover o registro da tabela Admin
        await admin.destroy({ transaction });
      }

      // Remover todas as associações com sistemas
      await user.setSistemas([], { transaction });
      
      // Excluir o usuário
      await user.destroy({ transaction });
      
      await transaction.commit();
      
      console.log('[USERS] Usuário excluído com sucesso');
      console.log('[USERS] ====== FIM DA EXCLUSÃO - SUCESSO ======\n');
      
      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      await transaction.rollback();
      
      console.error('\n[USERS] ====== ERRO NA EXCLUSÃO ======');
      console.error('[USERS] Tipo do erro:', error.name);
      console.error('[USERS] Mensagem:', error.message);
      console.error('[USERS] Stack:', error.stack);
      console.error('[USERS] ====== FIM DA EXCLUSÃO - ERRO ======\n');
      
      res.status(500).json({ 
        error: 'Erro ao excluir usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Atualizar status do usuário
  updateStatus: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      const user = await User.findByPk(id);
      
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.update({ ativo }, { transaction });
      await transaction.commit();

      res.json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ 
        error: 'Erro ao atualizar status',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Converter usuário em administrador
  convertToAdmin: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      console.log('\n[USERS] ====== INÍCIO DA CONVERSÃO PARA ADMIN ======');
      console.log('[USERS] ID:', req.params.id);
      console.log('[USERS] Dados:', req.body);

      // Buscar usuário
      const user = await User.findByPk(req.params.id, {
        transaction
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Criar admin com os dados do usuário
      const admin = await Admin.create({
      nome: req.body.nome || user.nome,
      email: req.body.email || user.email,
      senha: req.body.senha || user.senha,
        ativo: req.body.ativo !== undefined ? req.body.ativo : user.ativo
      }, { transaction });

      // Deletar usuário original
      await user.destroy({ transaction });

      await transaction.commit();
      
      console.log('[USERS] Usuário convertido para admin com sucesso');
      console.log('[USERS] ====== FIM DA CONVERSÃO - SUCESSO ======\n');
      
      res.json(admin);
    } catch (error) {
      await transaction.rollback();
      
      console.error('\n[USERS] ====== ERRO NA CONVERSÃO ======');
      console.error('[USERS] Tipo do erro:', error.name);
      console.error('[USERS] Mensagem:', error.message);
      console.error('[USERS] Stack:', error.stack);
      console.error('[USERS] ====== FIM DA CONVERSÃO - ERRO ======\n');
      
      res.status(500).json({ 
        error: 'Erro ao converter usuário em administrador',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Listar administradores
  listAdmins: async (req, res) => {
    try {
      console.log('\n[ADMINS] ====== INÍCIO DA LISTAGEM ======');
      
      const admins = await Admin.findAll({
        attributes: { exclude: ['senha', 'createdAt', 'updatedAt'] },
        order: [['nome', 'ASC']]
      });
      
      console.log('[ADMINS] Total de administradores encontrados:', admins.length);
      console.log('[ADMINS] ====== FIM DA LISTAGEM - SUCESSO ======\n');
      
      res.json(admins);
    } catch (error) {
      console.error('\n[ADMINS] ====== ERRO NA LISTAGEM ======');
      console.error('[ADMINS] Tipo do erro:', error.name);
      console.error('[ADMINS] Mensagem:', error.message);
      console.error('[ADMINS] Stack:', error.stack);
      console.error('[ADMINS] ====== FIM DA LISTAGEM - ERRO ======\n');
      
      res.status(500).json({ 
        error: 'Erro ao listar administradores',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
};

module.exports = userController;
