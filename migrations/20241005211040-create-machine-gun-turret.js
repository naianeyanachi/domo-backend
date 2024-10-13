'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MachineGunTurret', {
      idCitadel: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Citadel',
          key: 'id',
        },
      },
      idState: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      idNextState: {
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      level: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'LevelMachineGunTurret',
          key: 'level',
        },
      },
      finishTime: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('MachineGunTurret')
  },
}
