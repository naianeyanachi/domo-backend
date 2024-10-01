'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { LevelWeatherForecast } from './level-weather-forecast'

export class WeatherForecast extends Model {
  public idCitadel!: number
  public level!: number
  public idState!: number
  public levelWeatherForecast?: LevelWeatherForecast

  static associate(models: any) {
    WeatherForecast.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id',
      as: 'citadel',
    })
    WeatherForecast.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state',
    })
    WeatherForecast.belongsTo(models.LevelWeatherForecast, {
      foreignKey: 'level',
      targetKey: 'level',
      as: 'levelWeatherForecast',
    })
    WeatherForecast.hasOne(models.RepairWeatherForecast, {
      foreignKey: 'idStateFrom',
      sourceKey: 'idState',
      as: 'repairWeatherForecast',
    })
  }
}

export default (sequelize: Sequelize) => {
  WeatherForecast.init(
    {
      idCitadel: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Citadel',
          key: 'id',
        },
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'LevelWeatherForecast',
          key: 'level',
        },
      },
      idState: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WeatherForecast',
      tableName: 'WeatherForecast',
    }
  )

  return WeatherForecast
}
