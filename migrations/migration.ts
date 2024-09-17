import { QueryInterface, DataTypes } from 'sequelize';

interface Migration {
    up: (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => Promise<void>;
    down: (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => Promise<void>;
}

export default Migration;