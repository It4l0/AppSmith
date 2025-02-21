const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const sequelize = require('../config/database');

async function createInitialAdmin() {
  try {
    await sequelize.sync();
    
    // Verifica se já existe um admin
    const adminExists = await Admin.findOne({ where: { email: 'admin@appsmith.com' } });
    
    if (!adminExists) {
      // Cria o admin inicial
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        nome: 'Administrador',
        email: 'admin@appsmith.com',
        senha: hashedPassword,
        ativo: true
      });
      console.log('Admin criado com sucesso!');
      console.log('Email: admin@appsmith.com');
      console.log('Senha: admin123');
    } else {
      console.log('Admin já existe!');
    }
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    process.exit();
  }
}

createInitialAdmin();
