const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL com sucesso!');
    
    // Testar se o banco existe
    const result = await client.query('SELECT current_database()');
    console.log('Banco atual:', result.rows[0].current_database);
    
    // Testar se podemos criar uma tabela
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      )
    `);
    console.log('Tabela de teste criada com sucesso!');
    
    // Limpar
    await client.query('DROP TABLE test_connection');
    console.log('Tabela de teste removida com sucesso!');
    
  } catch (err) {
    console.error('Erro ao conectar:', err);
  } finally {
    await client.end();
  }
}

testConnection();
