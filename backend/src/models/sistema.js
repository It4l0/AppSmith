const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sistema = sequelize.define('Sistema', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O nome do sistema é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'O nome deve ter entre 2 e 100 caracteres'
      }
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
      isUrl: {
        msg: 'A URL deve ser válida'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'manutencao'),
    defaultValue: 'ativo',
    validate: {
      isIn: {
        args: [['ativo', 'inativo', 'manutencao']],
        msg: 'Status deve ser: ativo, inativo ou manutencao'
      }
    }
  },
  versao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  responsavel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sistemas',
  timestamps: true,
  underscored: true
});

module.exports = Sistema;
