const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const System = require('./System');
const Profile = require('./Profile');

const UserSystem = sequelize.define('UserSystem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  sistema_id: {
    type: DataTypes.INTEGER,
    references: {
      model: System,
      key: 'id'
    }
  },
  perfil_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Profile,
      key: 'id'
    }
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  data_vinculo: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'usuario_sistema'
});

// Define relationships
User.belongsToMany(System, { through: UserSystem, foreignKey: 'usuario_id' });
System.belongsToMany(User, { through: UserSystem, foreignKey: 'sistema_id' });
Profile.hasMany(UserSystem, { foreignKey: 'perfil_id' });
UserSystem.belongsTo(Profile, { foreignKey: 'perfil_id' });

module.exports = UserSystem;
