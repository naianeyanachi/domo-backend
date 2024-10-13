'use strict'
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'Enemy',
      [
        {
          type: 'TERRESTRIAL',
          attackLow: 10,
          attackHigh: 20,
          lifeLow: 10,
          lifeHigh: 20,
          defenseLow: 10,
          defenseHigh: 20,
          createdAt: time,
          updatedAt: time,
        },
        {
          type: 'AERIAL',
          attackLow: 10,
          attackHigh: 20,
          lifeLow: 10,
          lifeHigh: 20,
          defenseLow: 10,
          defenseHigh: 20,
          createdAt: time,
          updatedAt: time,
        },
        {
          type: 'UNDERGROUND',
          attackLow: 10,
          attackHigh: 20,
          lifeLow: 10,
          lifeHigh: 20,
          defenseLow: 10,
          defenseHigh: 20,
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
