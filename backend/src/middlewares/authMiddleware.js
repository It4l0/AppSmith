const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const LogService = require('../services/logService');

module.exports = async (req, res, next) => {
  try {
    LogService.info('[AUTH] Verificando autenticação');
    
    // Verifica se o token foi fornecido
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      LogService.warn('[AUTH] Token não fornecido');
      return res.status(401).json({ 
        error: 'Não autorizado',
        message: 'Token não fornecido'
      });
    }

    // Extrai o token do header
    const [, token] = authHeader.split(' ');

    if (!token) {
      LogService.warn('[AUTH] Token não fornecido no formato correto');
      return res.status(401).json({ 
        error: 'Não autorizado',
        message: 'Token não fornecido no formato correto'
      });
    }

    try {
      // Verifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'appsmith_secret_key_2024');
      
      // Busca o usuário
      const usuario = await Usuario.findByPk(decoded.id);
      
      if (!usuario) {
        LogService.warn('[AUTH] Usuário não encontrado');
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Usuário não encontrado'
        });
      }

      if (usuario.status !== 'ativo') {
        LogService.warn('[AUTH] Usuário inativo');
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Usuário inativo'
        });
      }

      // Adiciona o usuário ao objeto da requisição
      req.usuario = usuario;
      
      LogService.info('[AUTH] Usuário autenticado com sucesso');
      next();
    } catch (error) {
      LogService.error('[AUTH] Erro ao verificar token:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Não autorizado',
          message: 'Token expirado'
        });
      }
      return res.status(401).json({ 
        error: 'Não autorizado',
        message: 'Token inválido'
      });
    }
  } catch (error) {
    LogService.error('[AUTH] Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro interno',
      message: 'Erro ao processar autenticação'
    });
  }
};
