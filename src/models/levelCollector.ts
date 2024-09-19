'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

class LevelCollector extends Model {
  public level!: number;
  public yield!: number;
  public timeToCollect!: string;
  public upgradeResources!: number;
  public upgradeMaterials!: number;

  static associate(models: any) { }
}

export default (sequelize: Sequelize) => {
  LevelCollector.init({
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    yield: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeToCollect: {
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
      type: DataTypes.TIME
    },
  }, {
    sequelize,
    modelName: 'LevelCollector',
    tableName: 'LevelCollector',
  });

  return LevelCollector;
};