const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Sistema = require('./sistema');

const UsuarioSistema = sequelize.define('UsuarioSistema', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  sistemaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sistemas',
      key: 'id'
    }
  },
  dataAtribuicao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuario_sistemas',
  timestamps: true
});

// Definindo os relacionamentos
User.belongsToMany(Sistema, {
  through: UsuarioSistema,
  foreignKey: 'usuarioId',
  as: 'sistemas'
});

Sistema.belongsToMany(User, {
  through: UsuarioSistema,
  foreignKey: 'sistemaId',
  as: 'usuarios'
});

module.exports = UsuarioSistema;
