const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar todos os usuários
router.get('/', userController.list);

// Listar administradores
router.get('/admins', userController.listAdmins);

// Converter usuário em administrador
router.post('/:id/convert-to-admin', userController.convertToAdmin);

// Buscar usuário por ID
router.get('/:id', userController.getById);

// Criar novo usuário
router.post('/', userController.create);

// Atualizar usuário
router.put('/:id', userController.update);

// Excluir usuário
router.delete('/:id', userController.delete);

// Atualizar status do usuário
router.patch('/:id/status', userController.updateStatus);

module.exports = router;
