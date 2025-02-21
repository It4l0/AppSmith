const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Listar todos os usuários
router.get('/', usuarioController.listarUsuarios);

// Buscar usuário por ID
router.get('/:id', usuarioController.buscarUsuarioPorId);

// Criar novo usuário
router.post('/', usuarioController.criarUsuario);

// Atualizar usuário
router.put('/:id', usuarioController.atualizarUsuario);

// Excluir usuário
router.delete('/:id', usuarioController.excluirUsuario);

module.exports = router;
