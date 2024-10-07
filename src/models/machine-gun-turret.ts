'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class MachineGunTurret extends Model {
  public id!: number
  public idCitadel!: number
  public idState!: number
  public idNextState!: number
  public level!: number
  public finishTime!: Date
  public createdAt!: Date
  public updatedAt!: Date

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
      modelName: 'MachineGunTurret',
      tableName: 'MachineGunTurret',
    }
  )

  return MachineGunTurret
}