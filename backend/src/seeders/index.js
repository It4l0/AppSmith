const seedUsers = require('./userSeed');

async function runSeeders() {
  try {
    await seedUsers();
    console.log('Todos os seeds foram executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seeds:', error);
  } finally {
    process.exit();
  }
}

runSeeders();
