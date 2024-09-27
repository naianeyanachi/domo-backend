'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { Weather } from './weather'

export class WeatherPlayerOption extends Model {
  public idPlayer!: number
  public idWeather!: number
  public weather?: Weather

  static associate(models: any) {
    WeatherPlayerOption.hasOne(models.Weather, {
      foreignKey: 'id',
      sourceKey: 'idWeather',
      as: 'weather',
    })
    WeatherPlayerOption.hasOne(models.Player, {
      foreignKey: 'id',
      sourceKey: 'idPlayer',
      as: 'player',
    })
  }
}

export default (sequelize: Sequelize) => {
  WeatherPlayerOption.init(
    {
      idPlayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idWeather: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'WeatherPlayerOption',
      tableName: 'WeatherPlayerOption',
    }
  )

  return WeatherPlayerOption
}
