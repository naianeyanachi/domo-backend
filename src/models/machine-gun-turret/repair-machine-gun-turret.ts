'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class RepairMachineGunTurret extends Model {
  public id!: number
  public level!: number
  public idStateFrom!: number
  public idStateTo!: number
  public resources!: number
  public materials!: number
  public timeToRepair!: string

  static associate(models: any) {
    RepairMachineGunTurret.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateFrom',
    })
    RepairMachineGunTurret.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idStateTo',
    })
    RepairMachineGunTurret.belongsTo(models.LevelMachineGunTurret, { foreignKey: 'level' })
  }
}

export default (sequelize: Sequelize) => {
  RepairMachineGunTurret.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
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
      modelName: 'RepairMachineGunTurret',
      tableName: 'RepairMachineGunTurret',
    }
  )

  return RepairMachineGunTurret
}