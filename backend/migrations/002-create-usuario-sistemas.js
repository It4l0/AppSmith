'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuario_sistemas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sistema_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sistemas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data_atribuicao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Adicionando índice único para evitar duplicatas
    await queryInterface.addIndex('usuario_sistemas', ['usuario_id', 'sistema_id'], {
      unique: true,
      name: 'usuario_sistema_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuario_sistemas');
  }
};
