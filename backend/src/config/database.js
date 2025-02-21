const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Configuração do banco:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    },
    dialectOptions: {
      useUTC: false,
      charset: 'utf8mb4'
    },
    timezone: '-03:00',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Teste de conexão
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco:', err);
  });

module.exports = sequelize;
