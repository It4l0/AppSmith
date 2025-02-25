const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const LogService = require('../services/logService');

const authController = {
  login: async (req, res) => {
    try {
      LogService.info('[LOGIN] Iniciando tentativa de login');
      LogService.info('[LOGIN] Dados recebidos:', { email: req.body.email });

      const { email, senha } = req.body;

      if (!email || !senha) {
        LogService.warn('[LOGIN] Email ou senha não fornecidos');
        return res.status(400).json({ 
          error: 'Dados inválidos',
          message: 'Email e senha são obrigatórios'
        });
      }

      // Busca o usuário pelo email
      LogService.info('[LOGIN] Buscando usuário no banco de dados');
      const usuario = await Usuario.findOne({ 
        where: { 
          email,
          status: 'ativo'
        } 
      });
      
      if (!usuario) {
        LogService.warn('[LOGIN] Usuário não encontrado ou inativo para o email:', email);
        return res.status(401).json({ 
          error: 'Acesso negado',
          message: 'Credenciais inválidas ou usuário inativo'
        });
      }

      LogService.info('[LOGIN] Usuário encontrado, verificando senha');
      // Verifica a senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        LogService.warn('[LOGIN] Senha inválida para o email:', email);
        return res.status(401).json({ 
          error: 'Acesso negado',
          message: 'Credenciais inválidas'
        });
      }

      LogService.info('[LOGIN] Senha válida, gerando token');
      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'appsmith_secret_key_2024', {
        expiresIn: '1h'
      });

      LogService.info('[LOGIN] Token gerado com sucesso');
      res.json({ token });
    } catch (error) {
      LogService.error('[LOGIN] Erro no processo de login:', error);
      res.status(500).json({ 
        error: 'Erro no servidor',
        message: 'Ocorreu um erro ao tentar fazer login'
      });
    }
  },

  verifyToken: async (req, res) => {
    try {
      LogService.info('[VERIFY TOKEN] Verificando token');
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        LogService.warn('[VERIFY TOKEN] Token não fornecido');
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Token não fornecido'
        });
      }

      LogService.info('[VERIFY TOKEN] Decodificando token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'appsmith_secret_key_2024');
      
      LogService.info('[VERIFY TOKEN] Buscando usuário');
      const usuario = await Usuario.findByPk(decoded.id);

      if (!usuario) {
        LogService.warn('[VERIFY TOKEN] Usuário não encontrado para o token fornecido');
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Usuário não encontrado'
        });
      }

      if (usuario.status !== 'ativo') {
        LogService.warn('[VERIFY TOKEN] Conta de usuário está inativa');
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Conta inativa'
        });
      }

      // Remove a senha antes de enviar
      const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

      LogService.info('[VERIFY TOKEN] Token verificado com sucesso');
      res.json(usuarioSemSenha);
    } catch (error) {
      LogService.error('[VERIFY TOKEN] Erro ao verificar token:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Token expirado'
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Token inválido'
        });
      }
      res.status(500).json({ 
        error: 'Erro interno',
        message: 'Erro na verificação do token'
      });
    }
  }
};

module.exports = authController;
