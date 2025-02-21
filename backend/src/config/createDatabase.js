const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Conecta ao banco padrão postgres
  });

  try {
    await client.connect();
    
    // Verifica se o banco já existe
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (result.rows.length === 0) {
      // Cria o banco se não existir
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Banco de dados ${process.env.DB_NAME} criado com sucesso!`);
    } else {
      console.log(`Banco de dados ${process.env.DB_NAME} já existe!`);
    }
  } catch (error) {
    console.error('Erro ao criar banco de dados:', error);
  } finally {
    await client.end();
  }
}

createDatabase();
