const express = require('express');
const router = express.Router();
const sistemaController = require('../controllers/sistemaController');

// Listar todos os sistemas
router.get('/', sistemaController.listar);

// Buscar um sistema específico
router.get('/:id', sistemaController.buscarPorId);

// Criar um novo sistema
router.post('/', sistemaController.criar);

// Atualizar um sistema
router.put('/:id', sistemaController.atualizar);

// Excluir um sistema
router.delete('/:id', sistemaController.excluir);

module.exports = router;
