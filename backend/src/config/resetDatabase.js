const Sistema = require('../models/sistema');
const seedSistemas = require('../seeders/sistemaSeed');

async function resetDatabase() {
  try {
    console.log('Iniciando reset do banco de dados...');
    
    // Remover todos os sistemas
    await Sistema.destroy({ 
      where: {},
      force: true
    });
    console.log('Dados anteriores removidos com sucesso.');

    // Executar seed novamente
    await seedSistemas();
    console.log('Reset do banco de dados concluído com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao resetar banco de dados:', error);
    process.exit(1);
  }
}

resetDatabase();
