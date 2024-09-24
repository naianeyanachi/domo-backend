'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Factory', {
      idCitadel: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Citadel',
          key: 'id',
        },
      },
      idState: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      idNextState: {
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'LevelFactory',
          key: 'level',
        },
      },
      finishTime: {
        type: Sequelize.DATE,
      },
      health: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('Factory')
  },
}
