'use strict'
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'WeatherRequirement',
      [
        {
          idWeather: 2,
          idRequiredStructure: 1,
          level: 3,
          createdAt: time,
          updatedAt: time,
        },
        {
          idWeather: 2,
          idRequiredStructure: 2,
          level: 2,
          createdAt: time,
          updatedAt: time,
        },
        {
          idWeather: 3,
          idRequiredStructure: 3,
          level: 2,
          createdAt: time,
          updatedAt: time,
        },
        {
          idWeather: 4,
          idRequiredStructure: 3,
          level: 3,
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WeatherRequirement', null, {})
  },
}
