const Admin = require('../models/admin');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    await sequelize.sync();

    // Verifica se já existe um admin
    const adminExists = await Admin.findOne({ where: { email: 'admin@appsmith.com' } });
    
    if (!adminExists) {
      // Criptografa a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Cria o admin inicial
      await Admin.create({
        nome: 'Administrador',
        email: 'admin@appsmith.com',
        senha: hashedPassword,
        ativo: true
      });
      
      console.log('Admin inicial criado com sucesso!');
    } else {
      console.log('Admin já existe, pulando criação.');
    }

  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}

// Executa o seed
seedAdmin();
