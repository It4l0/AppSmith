const sequelize = require('../config/database');
const createTables = require('./001-create-tables');

async function runMigrations() {
  try {
    console.log('Iniciando migrações...');
    
    // Executar migração para criar tabelas
    await createTables.up(sequelize.getQueryInterface(), sequelize);
    
    console.log('Migrações concluídas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
    throw error;
  }
}

// Se este arquivo for executado diretamente
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Processo de migração finalizado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Falha no processo de migração:', error);
      process.exit(1);
    });
}
