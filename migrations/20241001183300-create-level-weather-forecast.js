'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LevelWeatherForecast', {
      level: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      forecastDays: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      upgradeResources: {
        type: Sequelize.INTEGER,
      },
      upgradeMaterials: {
        type: Sequelize.INTEGER,
      },
      timeToUpgrade: {
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
    await queryInterface.dropTable('LevelWeatherForecast')
  },
}
