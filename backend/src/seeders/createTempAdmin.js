const Admin = require('../models/admin');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

async function createTempAdmin() {
  try {
    await sequelize.sync();

    // Gera uma senha temporária
    const tempPassword = 'temp123';
    
    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Cria o admin temporário
    const tempAdmin = await Admin.create({
      nome: 'Admin Temporário',
      email: 'temp@local.dev',
      senha: hashedPassword,
      ativo: true
    });
    
    console.log('Admin temporário criado com sucesso!');
    console.log('Credenciais:');
    console.log('Email:', tempAdmin.email);
    console.log('Senha:', tempPassword);

  } catch (error) {
    console.error('Erro ao criar admin temporário:', error);
  } finally {
    process.exit();
  }
}

// Executa a criação
createTempAdmin();
