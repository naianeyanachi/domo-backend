'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class WeatherRequirement extends Model {
  public idWeather!: number
  public idRequiredStructure!: number
  public level!: number

  static associate(models: any) {
    WeatherRequirement.hasOne(models.Weather, {
      foreignKey: 'id',
      sourceKey: 'idWeather',
      as: 'weather',
    })
    WeatherRequirement.hasOne(models.Structure, {
      foreignKey: 'id',
      sourceKey: 'idRequiredStructure',
      as: 'structure',
    })
  }
}

export default (sequelize: Sequelize) => {
  WeatherRequirement.init(
    {
      idWeather: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idRequiredStructure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WeatherRequirement',
      tableName: 'WeatherRequirement',
    }
  )

  return WeatherRequirement
}