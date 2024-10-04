'use strict'
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'LevelWeatherForecast',
      [
        {
          level: 1,
          forecastDays: 1,
          upgradeResources: 5,
          upgradeMaterials: 0,
          timeToUpgrade: '00:00:15',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          forecastDays: 3,
          upgradeResources: 25,
          upgradeMaterials: 0,
          timeToUpgrade: '00:01:30',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          forecastDays: 6,
          upgradeResources: 50,
          upgradeMaterials: 5,
          timeToUpgrade: '00:05:00',
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('LevelWeatherForecast', null, {})
  },
}
