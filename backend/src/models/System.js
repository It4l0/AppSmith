const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const System = sequelize.define('System', {
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
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'manutencao'),
    defaultValue: 'ativo'
  },
  versao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  responsavel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ultimaAtualizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'sistemas'
});

module.exports = System;
