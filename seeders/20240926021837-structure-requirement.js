'use strict'
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'StructureRequirement',
      [
        {
          idStructure: 3,
          idRequiredStructure: 1,
          level: 3,
          createdAt: time,
          updatedAt: time,
        },
        {
          idStructure: 3,
          idRequiredStructure: 2,
          level: 2,
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('StructureRequirement', null, {})
  },
}
