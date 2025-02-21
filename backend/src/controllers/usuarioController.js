const User = require('../models/user');
const bcrypt = require('bcrypt');

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    console.log('[USUARIOS] Iniciando listagem de usuários');
    const usuarios = await User.findAll({
      attributes: ['id', 'nome', 'email', 'ativo', 'createdAt', 'updatedAt'],
      order: [['nome', 'ASC']]
    });
    
    console.log(`[USUARIOS] ${usuarios.length} usuários encontrados`);
    console.log('[USUARIOS] Usuários:', usuarios.map(u => ({ id: u.id, nome: u.nome })));
    
    // Formatando a resposta
    const response = usuarios.map(usuario => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.ativo ? 'ativo' : 'inativo',
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    }));
    
    res.json(response);
  } catch (error) {
    console.error('[USUARIOS] Erro ao listar usuários:', error);
    res.status(500).json({
      error: 'Erro ao listar usuários',
      message: 'Ocorreu um erro ao buscar a lista de usuários.'
    });
  }
};

// Buscar um usuário por ID
exports.buscarUsuarioPorId = async (req, res) => {
  try {
    console.log(`[USUARIOS] Buscando usuário por ID: ${req.params.id}`);
    const usuario = await User.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'email', 'ativo', 'createdAt', 'updatedAt']
    });
    
    if (!usuario) {
      console.log(`[USUARIOS] Usuário não encontrado: ${req.params.id}`);
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário solicitado não foi encontrado.'
      });
    }
    
    console.log(`[USUARIOS] Usuário encontrado: ${usuario.id} - ${usuario.nome}`);
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.ativo ? 'ativo' : 'inativo',
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
  } catch (error) {
    console.error('[USUARIOS] Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro ao buscar usuário',
      message: 'Ocorreu um erro ao buscar o usuário.'
    });
  }
};

// Criar um novo usuário
exports.criarUsuario = async (req, res) => {
  try {
    console.log('[USUARIOS] Criando novo usuário:', { ...req.body, senha: '[REDACTED]' });
    
    const usuario = await User.create({
      ...req.body,
      ativo: true
    });
    
    console.log(`[USUARIOS] Usuário criado com sucesso: ${usuario.id} - ${usuario.nome}`);
    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.ativo ? 'ativo' : 'inativo',
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
  } catch (error) {
    console.error('[USUARIOS] Erro ao criar usuário:', error);
    res.status(500).json({
      error: 'Erro ao criar usuário',
      message: error.message || 'Ocorreu um erro ao criar o usuário.'
    });
  }
};

// Atualizar um usuário
exports.atualizarUsuario = async (req, res) => {
  try {
    console.log(`[USUARIOS] Atualizando usuário ${req.params.id}:`, { ...req.body, senha: '[REDACTED]' });
    
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      console.log(`[USUARIOS] Usuário não encontrado: ${req.params.id}`);
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário que você está tentando atualizar não foi encontrado.'
      });
    }

    await usuario.update({
      ...req.body,
      ativo: req.body.status === 'ativo'
    });
    
    console.log(`[USUARIOS] Usuário atualizado com sucesso: ${usuario.id} - ${usuario.nome}`);
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.ativo ? 'ativo' : 'inativo',
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
  } catch (error) {
    console.error('[USUARIOS] Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro ao atualizar usuário',
      message: error.message || 'Ocorreu um erro ao atualizar o usuário.'
    });
  }
};

// Excluir um usuário
exports.excluirUsuario = async (req, res) => {
  try {
    console.log(`[USUARIOS] Excluindo usuário: ${req.params.id}`);
    
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      console.log(`[USUARIOS] Usuário não encontrado: ${req.params.id}`);
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário que você está tentando excluir não foi encontrado.'
      });
    }

    await usuario.destroy();
    
    console.log(`[USUARIOS] Usuário excluído com sucesso: ${req.params.id}`);
    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('[USUARIOS] Erro ao excluir usuário:', error);
    res.status(500).json({
      error: 'Erro ao excluir usuário',
      message: error.message || 'Ocorreu um erro ao excluir o usuário.'
    });
  }
};
