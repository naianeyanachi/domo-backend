'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LevelMachineGunTurret', {
      level: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      attack: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      defense: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      upgradeResources: {
        type: Sequelize.INTEGER,
      },
      upgradeMaterials: {
        type: Sequelize.INTEGER,
      },
      timeToUpgrade: {
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LevelMachineGunTurret')
  },
}
