const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

async function checkData() {
  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL');
    
    // Listar todas as tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTabelas encontradas:');
    for (const table of tables.rows) {
      // Pegar estrutura da tabela
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table.table_name]);
      
      console.log(`\n=== Tabela: ${table.table_name} ===`);
      console.log('Colunas:', columns.rows.map(col => `${col.column_name} (${col.data_type})`).join(', '));
      
      // Pegar dados
      const data = await client.query(`SELECT * FROM ${table.table_name}`);
      console.log('\nRegistros:');
      data.rows.forEach((row, i) => {
        console.log(`\nRegistro #${i + 1}:`);
        Object.entries(row).forEach(([key, value]) => {
          // Não mostrar a senha completa por segurança
          if (key === 'senha' && value) {
            console.log(`  ${key}: [HASH]`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        });
      });
    }
    
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await client.end();
  }
}

checkData();
