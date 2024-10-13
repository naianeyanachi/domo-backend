'use strict'
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'LevelMachineGunTurret',
      [
        {
          level: 1,
          attack: 10,
          defense: 5,
          upgradeResources: 5,
          upgradeMaterials: 0,
          timeToUpgrade: '00:00:15',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          attack: 20,
          defense: 10,
          upgradeResources: 25,
          upgradeMaterials: 0,
          timeToUpgrade: '00:01:30',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          attack: 30,
          defense: 15,
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
    await queryInterface.bulkDelete('LevelMachineGunTurret', null, {})
  },
}
