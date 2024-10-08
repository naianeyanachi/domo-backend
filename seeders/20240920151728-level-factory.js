'use strict'
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'LevelFactory',
      [
        {
          level: 1,
          resources: 1,
          yield: 1,
          timeToManufactor: '00:00:15',
          upgradeResources: 5,
          upgradeMaterials: 0,
          timeToUpgrade: '00:00:15',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          resources: 4,
          yield: 5,
          timeToManufactor: '00:01:00',
          upgradeResources: 25,
          upgradeMaterials: 0,
          timeToUpgrade: '00:01:30',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          resources: 150,
          yield: 200,
          timeToManufactor: '00:05:00',
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
    return queryInterface.bulkDelete('LevelFactory', null, {})
  },
}
