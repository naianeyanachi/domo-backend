'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WeatherPlayer', {
      idPlayer: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      idWeather: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      datetimeStart: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE,
      },
      datetimeEnd: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('WeatherPlayer')
  },
}
