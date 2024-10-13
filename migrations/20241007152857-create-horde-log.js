'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HordeLog', {
      idHorde: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Horde',
          key: 'id',
        },
      },
      idStructure: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Structure',
          key: 'id',
        },
      },
      idStateFrom: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      idStateTo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
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
    await queryInterface.dropTable('HordeLog')
  },
}
