'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class LevelFactory extends Model {
  public level!: number
  public resources!: number
  public yield!: number
  public timeToManufactor!: string
  public upgradeResources!: number
  public upgradeMaterials!: number
  public timeToUpgrade!: string

  static associate(models: any) {
    LevelFactory.hasMany(models.Factory, {
      sourceKey: 'level',
      foreignKey: 'level',
    })
  }

  static async getYield(level: number) {
    const levelCollector = await LevelFactory.findByPk(level)
    return levelCollector!.yield
  }

  static async getTimeToManufactor(level: number) {
    const levelFactory = await LevelFactory.findByPk(level)
    return levelFactory!.timeToManufactor
  }
}

export default (sequelize: Sequelize) => {
  LevelFactory.init(
    {
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      resources: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yield: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeToManufactor: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      upgradeResources: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      upgradeMaterials: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeToUpgrade: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'LevelFactory',
      tableName: 'LevelFactory',
    }
  )

  return LevelFactory
}
