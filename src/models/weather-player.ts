'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class WeatherPlayer extends Model {
  public idPlayer!: number
  public idWeather!: number
  public datetimeStart!: Date
  public datetimeEnd!: Date

  static associate(models: any) {
    WeatherPlayer.hasOne(models.Weather, {
      foreignKey: 'id',
      sourceKey: 'idWeather',
      as: 'weather',
    })
    WeatherPlayer.hasOne(models.Player, {
      foreignKey: 'id',
      sourceKey: 'idPlayer',
      as: 'player',
    })
  }
}

export default (sequelize: Sequelize) => {
  WeatherPlayer.init(
    {
      idPlayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idWeather: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      datetimeStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      datetimeEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WeatherPlayer',
      tableName: 'WeatherPlayer',
    }
  )

  return WeatherPlayer
}