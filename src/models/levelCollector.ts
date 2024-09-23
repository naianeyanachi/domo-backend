'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

export class LevelCollector extends Model {
  public level!: number;
  public yield!: number;
  public timeToCollect!: string;
  public upgradeResources!: number;
  public upgradeMaterials!: number;

  static associate(models: any) {
    LevelCollector.hasMany(models.Collector, {
      sourceKey: 'level',
      foreignKey: 'level'
    });
  }

  static async getYield(level: number) {
    const levelCollector = await LevelCollector.findByPk(level);
    return levelCollector!.yield;
  }

  static async getTimeToCollect(level: number) {
    const levelCollector = await LevelCollector.findByPk(level);
    return levelCollector!.timeToCollect;
  }
}

export default (sequelize: Sequelize) => {
  LevelCollector.init(
    {
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
      }
    },
    {
      sequelize,
      modelName: 'LevelCollector',
      tableName: 'LevelCollector'
    }
  );

  return LevelCollector;
};
