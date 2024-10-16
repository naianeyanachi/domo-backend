'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { HordeLog } from './horde-log'
import { HordeEnemy } from './horde-enemy'

export class Horde extends Model {
  public id!: number
  public datetime!: Date
  public idCitadel!: number
  public createdAt!: Date
  public updatedAt!: Date
  public enemies?: HordeEnemy[]
  public logs?: HordeLog[]

  static associate(models: any) {
    Horde.hasMany(models.HordeEnemy, { foreignKey: 'idHorde', as: 'enemies' })
    Horde.hasMany(models.HordeLog, { foreignKey: 'idHorde', as: 'logs' })
  }
}

export default (sequelize: Sequelize) => {
  Horde.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      idCitadel: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Horde',
      tableName: 'Horde',
    }
  )

  return Horde
}
