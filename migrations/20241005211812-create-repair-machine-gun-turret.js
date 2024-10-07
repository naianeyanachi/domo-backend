'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RepairMachineGunTurret', {
      level: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'LevelMachineGunTurret',
          key: 'level',
        },
      },
      idStateFrom: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      idStateTo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      resources: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      materials: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      timeToRepair: {
        allowNull: false,
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
    await queryInterface.dropTable('RepairMachineGunTurret');
  }
};