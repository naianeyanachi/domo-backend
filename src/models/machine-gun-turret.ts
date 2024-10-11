'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { RepairMachineGunTurret } from './repair-machine-gun-turret'
import { LevelMachineGunTurret } from './level-machine-gun-turret'
import { State } from './state'

export class MachineGunTurret extends Model {
  public id!: number
  public idCitadel!: number
  public idState!: number
  public idNextState!: number
  public level!: number
  public finishTime!: Date
  public createdAt!: Date
  public updatedAt!: Date
  public levelMachineGunTurret?: LevelMachineGunTurret
  public repairMachineGunTurret?: RepairMachineGunTurret
  public state?: State

  static associate(models: any) {
    MachineGunTurret.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id',
      as: 'citadel',
    })
    MachineGunTurret.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state',
    })
    MachineGunTurret.hasOne(models.LevelMachineGunTurret, {
      foreignKey: 'level',
      sourceKey: 'level',
      as: 'levelMachineGunTurret',
    })
    MachineGunTurret.hasOne(models.RepairMachineGunTurret, {
      foreignKey: 'idStateFrom',
      sourceKey: 'idState',
      as: 'repairMachineGunTurret',
    })
  }
}

export default (sequelize: Sequelize) => {
  MachineGunTurret.init(
    {
      idCitadel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idState: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idNextState: {
        type: DataTypes.INTEGER,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      finishTime: {
        type: DataTypes.DATE,
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
      modelName: 'MachineGunTurret',
      tableName: 'MachineGunTurret',
    }
  )

  return MachineGunTurret
}