'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export enum EnemyType {
  AERIAL = 'AERIAL',
  TERRESTRIAL = 'TERRESTRIAL',
  UNDERGROUND = 'UNDERGROUND',
}

export class Enemy extends Model {
  public id!: number
  public type!: string
  public attackLow!: number
  public attackHigh!: number
  public lifeLow!: number
  public lifeHigh!: number
  public defenseLow!: number
  public defenseHigh!: number

  static associate(models: any) {
    this.hasMany(models.HordeEnemy, { foreignKey: 'idEnemy' })
  }
}

export default (sequelize: Sequelize) => {
  Enemy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attackLow: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attackHigh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lifeLow: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lifeHigh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defenseLow: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defenseHigh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Enemy',
      tableName: 'Enemy',
    }
  )

  return Enemy
}
