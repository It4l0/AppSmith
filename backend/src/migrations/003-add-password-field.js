const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('[MIGRATION] Iniciando adição do campo senha');
      
      await queryInterface.addColumn('users', 'senha', {
        type: DataTypes.STRING,
        allowNull: true,
        after: 'email' // Adiciona o campo após o email
      });
      
      console.log('[MIGRATION] Campo senha adicionado com sucesso');
    } catch (error) {
      console.error('[MIGRATION] Erro ao adicionar campo senha:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log('[MIGRATION] Iniciando remoção do campo senha');
      
      await queryInterface.removeColumn('users', 'senha');
      
      console.log('[MIGRATION] Campo senha removido com sucesso');
    } catch (error) {
      console.error('[MIGRATION] Erro ao remover campo senha:', error);
      throw error;
    }
  }
};
