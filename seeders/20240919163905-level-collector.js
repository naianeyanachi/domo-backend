'use strict';
const { now } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now();
    await queryInterface.bulkInsert(
      'LevelCollector',
      [
        {
          level: 1,
          yield: 1,
          timeToCollect: '00:00:15',
          upgradeResources: 5,
          upgradeMaterials: 0,
          timeToUpgrade: '00:00:15',
          createdAt: time,
          updatedAt: time
        },
        {
          level: 2,
          yield: 5,
          timeToCollect: '00:01:00',
          upgradeResources: 25,
          upgradeMaterials: 0,
          timeToUpgrade: '00:01:30',
          createdAt: time,
          updatedAt: time
        },
        {
          level: 3,
          yield: 200,
          timeToCollect: '00:05:00',
          createdAt: time,
          updatedAt: time
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('LevelCollector', null, {});
  }
};
