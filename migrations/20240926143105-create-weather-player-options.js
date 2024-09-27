'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WeatherPlayerOption', {
      idPlayer: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      idWeather: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('WeatherPlayerOption')
  },
}
