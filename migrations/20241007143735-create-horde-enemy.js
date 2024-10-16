'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HordeEnemy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idHorde: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Horde',
          key: 'id',
        },
      },
      idEnemy: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Enemy',
          key: 'id',
        },
      },
      attack: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      life: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      defense: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      idTargetStructure: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Structure',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HordeEnemy')
  },
}
