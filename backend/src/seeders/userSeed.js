const User = require('../models/user');
const sequelize = require('../config/database');

const users = [
  {
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    cpf: '123.456.789-01',
    telefone: '(11) 99999-9999',
    cargo: 'Desenvolvedor',
    departamento: 'TI',
    ativo: true
  },
  {
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    cpf: '987.654.321-01',
    telefone: '(11) 98888-8888',
    cargo: 'Analista',
    departamento: 'RH',
    ativo: true
  },
  {
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    cpf: '456.789.123-01',
    telefone: '(11) 97777-7777',
    cargo: 'Gerente',
    departamento: 'Comercial',
    ativo: true
  }
];

const seedUsers = async () => {
  try {
    await sequelize.sync();
    console.log('Iniciando seed de usuários...');
    
    for (const userData of users) {
      const userExists = await User.findOne({ where: { email: userData.email } });
      if (!userExists) {
        await User.create(userData);
        console.log(`Usuário ${userData.nome} criado com sucesso!`);
      } else {
        console.log(`Usuário ${userData.nome} já existe.`);
      }
    }

    console.log('Seed de usuários concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
    throw error;
  } finally {
    process.exit();
  }
}

module.exports = seedUsers;
