const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// Rota de login (pública)
router.post('/login', authController.login);

// Rota para verificar token (protegida)
router.get('/verificar', auth, authController.verificarToken);

module.exports = router;
