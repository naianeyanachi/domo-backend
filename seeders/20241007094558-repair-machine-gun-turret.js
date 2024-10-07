'use strict';
const { now } = require('sequelize/lib/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert(
      'RepairMachineGunTurret',
      [
        {
          level: 1,
          idStateFrom: 5,
          idStateTo: 4,
          resources: 1,
          materials: 0,
          timeToRepair: '00:00:05',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 1,
          idStateFrom: 4,
          idStateTo: 3,
          resources: 1,
          materials: 0,
          timeToRepair: '00:00:05',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 1,
          idStateFrom: 3,
          idStateTo: 2,
          resources: 1,
          materials: 0,
          timeToRepair: '00:00:05',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 1,
          idStateFrom: 2,
          idStateTo: 1,
          resources: 5,
          materials: 0,
          timeToRepair: '00:00:05',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          idStateFrom: 5,
          idStateTo: 4,
          resources: 2,
          materials: 0,
          timeToRepair: '00:00:04',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          idStateFrom: 4,
          idStateTo: 3,
          resources: 2,
          materials: 0,
          timeToRepair: '00:00:04',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          idStateFrom: 3,
          idStateTo: 2,
          resources: 2,
          materials: 0,
          timeToRepair: '00:00:04',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 2,
          idStateFrom: 2,
          idStateTo: 1,
          resources: 10,
          materials: 0,
          timeToRepair: '00:00:04',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          idStateFrom: 5,
          idStateTo: 4,
          resources: 3,
          materials: 0,
          timeToRepair: '00:00:03',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          idStateFrom: 4,
          idStateTo: 3,
          resources: 3,
          materials: 0,
          timeToRepair: '00:00:03',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          idStateFrom: 3,
          idStateTo: 2,
          resources: 3,
          materials: 0,
          timeToRepair: '00:00:03',
          createdAt: time,
          updatedAt: time,
        },
        {
          level: 3,
          idStateFrom: 2,
          idStateTo: 1,
          resources: 15,
          materials: 0,
          timeToRepair: '00:00:03',
          createdAt: time,
          updatedAt: time,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RepairMachineGunTurret', null, {});
  }
};
