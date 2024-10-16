'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { Structure } from './structure'
import { Enemy } from './enemy'

export class HordeEnemy extends Model {
  public id!: number
  public idHorde!: number
  public idEnemy!: number
  public attack!: number
  public life!: number
  public defense!: number
  public idTargetStructure!: number
  public createdAt!: Date
  public updatedAt!: Date
  public targetStructure?: Structure
  public enemy?: Enemy

  static associate(models: any) {
    HordeEnemy.belongsTo(models.Horde, { foreignKey: 'idHorde', as: 'horde' })
    HordeEnemy.belongsTo(models.Enemy, { foreignKey: 'idEnemy', as: 'enemy' })
    HordeEnemy.belongsTo(models.Structure, {
      foreignKey: 'idTargetStructure',
      as: 'targetStructure',
    })
  }
}

export default (sequelize: Sequelize) => {
  HordeEnemy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idHorde: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idEnemy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attack: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      life: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defense: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idTargetStructure: {
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
      modelName: 'HordeEnemy',
      tableName: 'HordeEnemy',
    }
  )

  return HordeEnemy
}
