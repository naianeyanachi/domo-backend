'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Weather', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      weather: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      down: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      idWorstState: {
        type: Sequelize.INTEGER,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      minDuration: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      percentageChance: {
        allowNull: false,
        type: Sequelize.DOUBLE,
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
    await queryInterface.dropTable('Weather')
  },
}
