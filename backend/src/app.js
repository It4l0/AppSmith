const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const routes = require('./routes');
const LogService = require('./services/logService');


// Load environment variables
dotenv.config();

const app = express();

// Configuração do CORS
app.use(cors());

// Middleware para logs de requisição
app.use((req, res, next) => {
  LogService.info(`[${req.method}] ${req.path}`);
  next();
});

// Middleware para parsing de JSON
app.use(express.json());

// Rotas da API
app.use('/', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  LogService.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado no servidor.'
  });
});

// Teste de conexão com o banco
sequelize.authenticate()
  .then(() => {
    LogService.info('Conexão com o banco estabelecida com sucesso');
  })
  .catch(err => {
    LogService.error('Erro ao conectar com o banco:', err);
  });

module.exports = app;
