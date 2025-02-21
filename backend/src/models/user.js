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
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11],
      is: /^\d{11}$/
    }
  },
  observacoes: {
    type: DataTypes.TEXT,
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
      if (user.cpf) {
        user.cpf = user.cpf.replace(/\D/g, '');
      }
    },
    beforeUpdate: async (user) => {
      console.log('[USER] Atualizando usuário');
      if (user.changed('senha')) {
        console.log('[USER] Senha modificada, criptografando nova senha');
        user.senha = await bcrypt.hash(user.senha, 10);
      }
      if (user.changed('cpf')) {
        user.cpf = user.cpf.replace(/\D/g, '');
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
