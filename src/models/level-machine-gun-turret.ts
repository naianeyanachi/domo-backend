'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class LevelMachineGunTurret extends Model {
  public id!: number
  public level!: number
  public upgradeResources!: number
  public upgradeMaterials!: number
  public timeToUpgrade!: string

  static associate(models: any) {
    LevelMachineGunTurret.hasMany(models.MachineGunTurret, {
      sourceKey: 'level',
      foreignKey: 'level',
    })
  }
}

export default (sequelize: Sequelize) => {
  LevelMachineGunTurret.init(
    {
      level: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attack: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      defense: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      upgradeResources: {
        type: DataTypes.INTEGER,
      },
      upgradeMaterials: {
        type: DataTypes.INTEGER,
      },
      timeToUpgrade: {
        type: DataTypes.TIME,
      },
    },
    {
      sequelize,
      modelName: 'LevelMachineGunTurret',
      tableName: 'LevelMachineGunTurret',
    }
  )

  return LevelMachineGunTurret
}