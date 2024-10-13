'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Enemy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      attackLow: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      attackHigh: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      lifeLow: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      lifeHigh: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      defenseLow: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      defenseHigh: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Enemy')
  },
}
