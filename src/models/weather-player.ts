'use strict'
import { Model, DataTypes, Sequelize, Op } from 'sequelize'
import { Weather } from './weather'

export class WeatherPlayer extends Model {
  public idPlayer!: number
  public idWeather!: number
  public datetimeStart!: Date
  public datetimeEnd!: Date
  public weather!: Weather

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

  static async getWeather(db: any, idPlayer: number, date: Date) {
    return await db.WeatherPlayer.findOne({
      where: {
        idPlayer,
        datetimeStart: {
          [Op.lte]: date,
        },
        datetimeEnd: {
          [Op.gte]: date,
        },
      },
      include: [
        {
          model: db.Weather,
          as: 'weather',
          include: [
            {
              model: db.State,
              as: 'worstState',
            },
          ],
        },
      ],
    })
  }
}

export default (sequelize: Sequelize) => {
  WeatherPlayer.init(
    {
      idPlayer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      idWeather: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
