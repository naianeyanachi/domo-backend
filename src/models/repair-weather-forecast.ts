'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class RepairWeatherForecast extends Model {
  public level!: number
  public idStateFrom!: number
  public idStateTo!: number
  public resources!: number
  public materials!: number
  public timeToRepair!: string // Using string for TIME type

  static associate(models: any) {
    RepairWeatherForecast.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateFrom',
    })
    RepairWeatherForecast.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateTo',
    })
    RepairWeatherForecast.belongsTo(models.LevelWeatherForecast, {
      foreignKey: 'level',
    })
  }
}

export default (sequelize: Sequelize) => {
  RepairWeatherForecast.init(
    {
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'LevelWeatherForecast',
          key: 'level',
        },
      },
      idStateFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      idStateTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'State',
          key: 'id',
        },
      },
      resources: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      materials: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeToRepair: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RepairWeatherForecast',
      tableName: 'RepairWeatherForecast',
    }
  )

  return RepairWeatherForecast
}
