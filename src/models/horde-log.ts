'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class HordeLog extends Model {
  public id!: number
  public idHorde!: number
  public idStructure!: number
  public idStateFrom!: number
  public idStateTo!: number
  public createdAt!: Date
  public updatedAt!: Date

  static associate(models: any) {
    HordeLog.belongsTo(models.Horde, { foreignKey: 'idHorde' })
    HordeLog.belongsTo(models.Structure, { foreignKey: 'idStructure' })
    HordeLog.hasOne(models.State, { foreignKey: 'id', sourceKey: 'idStateFrom' })
    HordeLog.hasOne(models.State, { foreignKey: 'id', sourceKey: 'idStateTo' })
  }
}

export default (sequelize: Sequelize) => {
  HordeLog.init(
    {
      idHorde: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idStructure: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idStateFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idStateTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'HordeLog',
      tableName: 'HordeLogs',
    }
  )

  return HordeLog
}