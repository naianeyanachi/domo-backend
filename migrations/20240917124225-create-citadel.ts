import { QueryInterface, DataTypes } from 'sequelize';
import Migration from './migration';

const migration: Migration = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    await queryInterface.createTable('Citadels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      resources: {
        type: Sequelize.INTEGER
      },
      materials: {
        type: Sequelize.INTEGER
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
  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    await queryInterface.dropTable('Citadels');
  }
};

export default migration;