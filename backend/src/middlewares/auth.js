const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.auth = async (req, res, next) => {
  console.log('[AUTH] Iniciando verificação de autenticação');
  console.log('[AUTH] Headers:', req.headers);
  
  try {
    // Verifica se o header de autorização existe
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('[AUTH] Erro: Token não fornecido');
      return res.status(401).json({ 
        error: 'Token não fornecido',
        details: 'O header de autorização é obrigatório'
      });
    }

    // Verifica se o formato do token está correto
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      console.log('[AUTH] Erro: Token mal formatado (número de partes incorreto)');
      return res.status(401).json({ 
        error: 'Token mal formatado',
        details: 'O token deve estar no formato: Bearer <token>'
      });
    }

    const [scheme, token] = parts;

    // Verifica se o esquema é Bearer
    if (!/^Bearer$/i.test(scheme)) {
      console.log('[AUTH] Erro: Token mal formatado (scheme incorreto)');
      return res.status(401).json({ 
        error: 'Token mal formatado',
        details: 'O token deve começar com Bearer'
      });
    }

    try {
      console.log('[AUTH] Verificando token JWT');
      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[AUTH] Token decodificado:', decoded);
      
      // Busca o admin
      console.log('[AUTH] Buscando admin');
      const admin = await Admin.findByPk(decoded.id);
      console.log('[AUTH] Admin encontrado:', admin ? { id: admin.id, ativo: admin.ativo } : 'não encontrado');

      // Verifica se o admin existe e está ativo
      if (!admin || !admin.ativo) {
        console.log('[AUTH] Erro: Admin não encontrado ou inativo');
        return res.status(401).json({ 
          error: 'Token inválido',
          details: 'Usuário não encontrado ou inativo'
        });
      }

      // Adiciona o admin à requisição
      req.admin = admin;
      
      console.log('[AUTH] Autenticação bem-sucedida');
      return next();
    } catch (err) {
      console.log('[AUTH] Erro ao verificar token JWT:', err);
      return res.status(401).json({ 
        error: 'Token inválido',
        details: process.env.NODE_ENV === 'development' ? err.message : null
      });
    }
  } catch (error) {
    console.error('[AUTH] Erro inesperado:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};
