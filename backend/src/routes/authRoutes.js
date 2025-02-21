const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de login
router.post('/login', authController.login);

// Rota para verificar token
router.get('/verify-token', authController.verifyToken);

module.exports = router;
