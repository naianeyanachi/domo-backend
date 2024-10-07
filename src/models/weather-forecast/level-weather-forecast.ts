'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class LevelWeatherForecast extends Model {
  public level!: number
  public forecastDays!: number
  public upgradeResources!: number
  public upgradeMaterials!: number
  public timeToUpgrade!: string

  static associate(models: any) {
    LevelWeatherForecast.hasMany(models.WeatherForecast, {
      foreignKey: 'level',
      sourceKey: 'level',
    })
  }
}

export default (sequelize: Sequelize) => {
  LevelWeatherForecast.init(
    {
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      forecastDays: {
        type: DataTypes.DOUBLE,
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
      modelName: 'LevelWeatherForecast',
      tableName: 'LevelWeatherForecast',
    }
  )

  return LevelWeatherForecast
}
