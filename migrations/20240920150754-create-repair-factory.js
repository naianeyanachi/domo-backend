'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'RepairFactory',
      {
        level: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: {
            model: 'LevelFactory',
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
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        materials: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        timeToRepair: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {}
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RepairFactory')
  },
}
