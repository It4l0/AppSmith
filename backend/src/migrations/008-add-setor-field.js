'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'setor', {
      type: Sequelize.STRING,
      allowNull: true // Inicialmente como nullable para não quebrar registros existentes
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'setor');
  }
};
