'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { Citadel } from './citadel'
import { State } from './state'
import { LevelFactory } from './levelFactory'
import { RepairFactory } from './repairFactory'

export class Factory extends Model {
  public idCitadel!: number
  public idState!: number
  public idNextState!: number | null
  public level!: number
  public finishTime!: Date | null
  public health!: number
  public state?: State
  public levelFactory?: LevelFactory
  public citadel?: Citadel
  public repairFactory?: RepairFactory

  static associate(models: any) {
    Factory.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id',
      as: 'citadel',
    })
    Factory.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state',
    })
    Factory.hasOne(models.LevelFactory, {
      foreignKey: 'level',
      sourceKey: 'level',
      as: 'levelFactory',
    })
    Factory.hasOne(models.RepairFactory, {
      foreignKey: 'idStateFrom',
      sourceKey: 'idState',
      as: 'repairFactory',
    })
  }

  async updateFactory(db: any) {
    if (!this.finishTime) {
      return
    }
    if (this.finishTime < new Date()) {
      if (this.idState == (await db.State.getManufacturingState()).id) {
        const yieldFactory = this.levelFactory!.yield
        await this.citadel!.addMaterials(yieldFactory)
      }

      this.finishTime = null
      this.idState = this.idNextState!
      this.idNextState = null
      await this.save()
    }
  }

  async manufacture(db: any) {
    if (this.finishTime) {
      throw new Error('Factory busy')
    }
    if (this.citadel!.resources < this.levelFactory!.resources) {
      throw new Error('Not enough resources')
    }

    this.citadel!.resources -= this.levelFactory!.resources
    await this.citadel!.save()

    const timeToManufactor = this.levelFactory!.timeToManufactor
    const [hours, minutes, seconds] = timeToManufactor.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    this.idNextState = this.idState
    const manufacturingState = await db.State.getManufacturingState()
    this.idState = manufacturingState.id

    await this.save()
  }

  async repair(db: any) {
    const repairState = await db.State.getRepairingState()
    if (this.idState == repairState.id) {
      throw new Error('Factory is already repairing')
    }
    if (!this.state?.canRepair()) {
      throw new Error('Factory cannot be repaired')
    }
    if (this.citadel!.resources < this.repairFactory!.resources) {
      throw new Error('Not enough resources to repair')
    }
    if (this.citadel!.materials < this.repairFactory!.materials) {
      throw new Error('Not enough materials to repair')
    }

    this.citadel!.resources -= this.repairFactory!.resources
    this.citadel!.materials -= this.repairFactory!.materials
    await this.citadel!.save()

    const timeToRepair = this.repairFactory!.timeToRepair
    const [hours, minutes, seconds] = timeToRepair.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    this.idState = repairState.id
    this.idNextState = this.repairFactory!.idStateTo

    await this.save()
  }
}

export default (sequelize: Sequelize) => {
  Factory.init(
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
        type: DataTypes.TIME,
      },
      health: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Factory',
      tableName: 'Factory',
    }
  )

  return Factory
}
