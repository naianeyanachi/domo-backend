'use strict';

const { now } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const time = now()
    await queryInterface.bulkInsert('State', [
      {
        state: "REINFORCED",
        createdAt: time,
        updatedAt: time,
      },
      {
        state: "OK",
        createdAt: time,
        updatedAt: time,
      },
      {
        state: "WORN",
        createdAt: time,
        updatedAt: time,
      },
      {
        state: "DAMAGED",
        createdAt: time,
        updatedAt: time,
      },
      {
        state: "DESTROYED",
        createdAt: time,
        updatedAt: time,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('State', null, {});
  }
};
