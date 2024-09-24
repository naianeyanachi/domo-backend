'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class RepairFactory extends Model {
  public level!: number
  public idStateFrom!: number
  public idStateTo!: number
  public resources!: number
  public materials!: number
  public timeToRepair!: string

  static associate(models: any) {
    RepairFactory.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateFrom',
    })
    RepairFactory.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateTo',
    })
    RepairFactory.belongsTo(models.LevelFactory, { foreignKey: 'level' })
  }
}

export default (sequelize: Sequelize) => {
  RepairFactory.init(
    {
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idStateFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idStateTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'RepairFactory',
      tableName: 'RepairFactory',
    }
  )

  return RepairFactory
}
