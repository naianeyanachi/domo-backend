'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'Weather',
      [
        {
          weather: 'NORMAL',
          down: 0,
          idWorstState: 2,
          minDuration: "01:00:00",
          percentageChance: 100,
          createdAt: time,
          updatedAt: time,
        },
        {
          weather: 'CORROSIVE_RAIN',
          down: 1,
          idWorstState: 3,
          minDuration: "01:30:00",
          percentageChance: 1,
          createdAt: time,
          updatedAt: time,
        },
        {
          weather: 'BLIZZARD',
          down: 2,
          idWorstState: 4,
          minDuration: "06:00:00",
          percentageChance: 2,
          createdAt: time,
          updatedAt: time,
        },
        {
          weather: 'METEOR_SHOWER',
          down: 3,
          idWorstState: 5,
          minDuration: "00:30:00",
          percentageChance: 3,
          createdAt: time,
          updatedAt: time,
        },
      ],
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Weather', null, {})
  }
};
