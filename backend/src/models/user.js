const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      console.log('[USER] Criando novo usuário');
      if (user.senha) {
        console.log('[USER] Criptografando senha');
        user.senha = await bcrypt.hash(user.senha, 10);
      }
    },
    beforeUpdate: async (user) => {
      console.log('[USER] Atualizando usuário');
      if (user.changed('senha')) {
        console.log('[USER] Senha modificada, criptografando nova senha');
        user.senha = await bcrypt.hash(user.senha, 10);
      }
    }
  }
});

// Método para verificar senha
User.prototype.checkPassword = async function(senha) {
  if (!this.senha) return false;
  return bcrypt.compare(senha, this.senha);
};

module.exports = User;
