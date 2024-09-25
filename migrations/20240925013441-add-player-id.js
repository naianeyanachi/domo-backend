'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(transaction => {
      return queryInterface.addColumn(
        'Citadel',
        'idPlayer',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Player',
            key: 'id',
          },
        },
        { transaction }
      )
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(transaction => {
      return queryInterface.removeColumn('Citadel', 'idPlayer', { transaction })
    })
  },
}
