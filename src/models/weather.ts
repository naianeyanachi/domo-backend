'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { State } from './state'

export const NORMAL = 'NORMAL'
export const BLIZZARD = 'BLIZZARD'
export const CORROSIVE_RAIN = 'CORROSIVE_RAIN'
export const METEOR_SHOWER = 'METEOR_SHOWER'

export class Weather extends Model {
  public id!: number
  public weather!: string
  public down!: number
  public idWorstState!: number
  public minDuration!: string
  public percentageChance!: number
  public worstState?: State

  static associate(models: any) {
    Weather.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idWorstState',
      as: 'worstState',
    })
    Weather.hasMany(models.WeatherRequirement, {
      foreignKey: 'idWeather',
      sourceKey: 'id',
    })
  }
}

export default (sequelize: Sequelize) => {
  Weather.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      weather: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      down: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idWorstState: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      minDuration: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      percentageChance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Weather',
      tableName: 'Weather',
    }
  )

  return Weather
}
