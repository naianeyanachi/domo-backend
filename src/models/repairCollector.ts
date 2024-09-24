'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class RepairCollector extends Model {
  public level!: number
  public idStateFrom!: number
  public idStateTo!: number
  public resources!: number
  public materials!: number
  public timeToRepair!: string

  static associate(models: any) {
    RepairCollector.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateFrom',
    })
    RepairCollector.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateTo',
    })
    RepairCollector.belongsTo(models.LevelCollector, { foreignKey: 'level' })
  }
}

export default (sequelize: Sequelize) => {
  RepairCollector.init(
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
      modelName: 'RepairCollector',
      tableName: 'RepairCollector',
    }
  )

  return RepairCollector
}
