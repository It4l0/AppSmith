const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'admins',
  hooks: {
    beforeCreate: async (admin) => {
      console.log('[ADMIN] Criando novo admin');
      if (admin.senha) {
        console.log('[ADMIN] Criptografando senha');
        admin.senha = await bcrypt.hash(admin.senha, 10);
      }
    },
    beforeUpdate: async (admin) => {
      console.log('[ADMIN] Atualizando admin');
      if (admin.changed('senha')) {
        console.log('[ADMIN] Senha modificada, criptografando nova senha');
        admin.senha = await bcrypt.hash(admin.senha, 10);
      }
    }
  }
});

Admin.prototype.checkPassword = async function(senha) {
  console.log('[ADMIN] Verificando senha');
  console.log('[ADMIN] Hash armazenado:', this.senha);
  const resultado = await bcrypt.compare(senha, this.senha);
  console.log('[ADMIN] Resultado da verificação:', resultado);
  return resultado;
};

module.exports = Admin;
