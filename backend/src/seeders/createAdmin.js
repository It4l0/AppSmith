const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    const adminExists = await Admin.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminExists) {
      await Admin.create({
        nome: 'Administrador',
        email: 'admin@example.com',
        senha: 'admin123',
        ativo: true
      });
      console.log('Administrador criado com sucesso!');
    } else {
      console.log('Administrador já existe!');
    }
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
  }
}

createAdmin();
