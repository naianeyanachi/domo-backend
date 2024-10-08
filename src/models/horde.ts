'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class Horde extends Model {
  public id!: number
  public datetime!: Date
  public idCitadel!: number
  public createdAt!: Date
  public updatedAt!: Date

  static associate(models: any) {
    this.hasMany(models.HordeEnemy, { foreignKey: 'idHorde', as: 'enemies' })
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