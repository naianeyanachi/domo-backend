'use strict';
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'Structure',
      [
        {
          structure: 'Collector',
          buildResources: 0,
          buildMaterials: 0,
          createdAt: time,
          updatedAt: time,
        },
        {
          structure: 'Factory',
          buildResources: 0,
          buildMaterials: 0,
          createdAt: time,
          updatedAt: time,
        },
        {
          structure: 'WeatherForecast',
          buildResources: 200,
          buildMaterials: 20,
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Structure', null, {})
  }
};
