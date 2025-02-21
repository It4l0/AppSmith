const sequelize = require('./database');
const Admin = require('../models/Admin');
const User = require('../models/user');

async function syncDatabase() {
  try {
    // Sincroniza sem forçar recriação das tabelas
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error; // Propaga o erro para ser tratado por quem chamou
  }
}

module.exports = syncDatabase;
