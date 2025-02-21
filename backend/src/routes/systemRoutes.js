const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar todos os sistemas
router.get('/', systemController.list);

// Buscar sistema por ID
router.get('/:id', systemController.getById);

// Criar novo sistema
router.post('/', systemController.create);

// Atualizar sistema
router.put('/:id', systemController.update);

// Excluir sistema
router.delete('/:id', systemController.delete);

// Atualizar status do sistema
router.patch('/:id/status', systemController.updateStatus);

module.exports = router;
