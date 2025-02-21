const app = require('./src/app');
const LogService = require('./src/services/logService');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  LogService.info('\n====== SERVIDOR INICIADO ======');
  LogService.info(`Servidor rodando na porta ${PORT}`);
  LogService.info(`URL: http://localhost:${PORT}`);
  LogService.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  LogService.info('==============================\n');
});
