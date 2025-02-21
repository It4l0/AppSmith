const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('[MIGRATION] Iniciando criação da tabela admins');
      
      await queryInterface.createTable('admins', {
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
          unique: true
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
      
      console.log('[MIGRATION] Tabela admins criada com sucesso');
    } catch (error) {
      console.error('[MIGRATION] Erro ao criar tabela admins:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admins');
  }
};
