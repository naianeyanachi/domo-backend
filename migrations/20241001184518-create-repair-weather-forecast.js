'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RepairWeatherForecast', {
      level: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'LevelWeatherForecast',
          key: 'level',
        },
      },
      idStateFrom: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      idStateTo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      resources: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      materials: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      timeToRepair: {
        allowNull: false,
        type: Sequelize.TIME,
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
    await queryInterface.dropTable('RepairWeatherForecast')
  },
}
