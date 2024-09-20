'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

class LevelFactory extends Model {
  public level!: number;
  public yield!: number;
  public timeToManufactor!: string;
  public upgradeResources!: number;
  public upgradeMaterials!: number;
  public timeToUpgrade!: string;

  static associate(models: any) {
    // define association here
  }
}

export default (sequelize: Sequelize) => {
  LevelFactory.init({
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    yield: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeToManufactor: {
      type: DataTypes.TIME,
      allowNull: false
    },
    upgradeResources: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    upgradeMaterials: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeToUpgrade: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'LevelFactory',
    tableName: 'LevelFactory',
  });

  return LevelFactory;
};