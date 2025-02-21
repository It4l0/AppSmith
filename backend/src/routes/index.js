const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuarioRoutes');
const sistemaRoutes = require('./sistemaRoutes');

// Rotas de usuários
router.use('/users', usuarioRoutes);

// Rotas de sistemas
router.use('/sistemas', sistemaRoutes);

module.exports = router;
