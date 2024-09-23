'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LevelFactory', {
      level: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resources: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      yield: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timeToManufactor: {
        type: Sequelize.TIME,
        allowNull: false
      },
      upgradeResources: {
        type: Sequelize.INTEGER
      },
      upgradeMaterials: {
        type: Sequelize.INTEGER
      },
      timeToUpgrade: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LevelFactory');
  }
};
