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
          structure: 'MachineGunTurret',
          buildResources: 5,
          buildMaterials: 1,
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
    await queryInterface.bulkInsert(
      'StructureRequirement',
      [
        {
          idStructure: 4,
          idRequiredStructure: 1,
          level: 2,
          createdAt: time,
          updatedAt: time,
        },
        {
          idStructure: 4,
          idRequiredStructure: 2,
          level: 1,
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Structure', { structure: 'MachineGunTurret' }, {});
    await queryInterface.bulkDelete('StructureRequirement', { idStructure: 4 }, {});
  }
};
