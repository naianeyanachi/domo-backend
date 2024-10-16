'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

const OK = 'OK'
const REPAIRING = 'REPAIRING'
const UPGRADING = 'UPGRADING'
const COLLECTING = 'COLLECTING'
const MANUFACTURING = 'MANUFACTURING'
const WORN = 'WORN'
const DAMAGED = 'DAMAGED'
const DESTROYED = 'DESTROYED'
const REINFORCED = 'REINFORCED'

export class State extends Model {
  public id!: number
  public state!: string

  static associate(models: any) {
    State.hasMany(models.RepairCollector, {
      foreignKey: 'idStateFrom',
      sourceKey: 'id',
    })
    State.hasMany(models.RepairCollector, {
      foreignKey: 'idStateTo',
      sourceKey: 'id',
    })
    State.hasMany(models.RepairFactory, {
      foreignKey: 'idStateFrom',
      sourceKey: 'id',
    })
    State.hasMany(models.RepairFactory, {
      foreignKey: 'idStateTo',
      sourceKey: 'id',
    })
  }

  static async getOKState(): Promise<State> {
    return (await this.findOne({ where: { state: OK } })) as State
  }

  static async getRepairingState(): Promise<State> {
    return (await this.findOne({ where: { state: REPAIRING } })) as State
  }

  static async getUpgradingState(): Promise<State> {
    return (await this.findOne({ where: { state: UPGRADING } })) as State
  }

  static async getCollectingState(): Promise<State> {
    return (await this.findOne({ where: { state: COLLECTING } })) as State
  }

  static async getManufacturingState(): Promise<State> {
    return (await this.findOne({ where: { state: MANUFACTURING } })) as State
  }

  static async getReinforcedState(): Promise<State> {
    return (await this.findOne({ where: { state: REINFORCED } })) as State
  }

  static async getWornState(): Promise<State> {
    return (await this.findOne({ where: { state: WORN } })) as State
  }

  static async getDamagedState(): Promise<State> {
    return (await this.findOne({ where: { state: DAMAGED } })) as State
  }

  static async getDestroyedState(): Promise<State> {
    return (await this.findOne({ where: { state: DESTROYED } })) as State
  }

  isManufacturing(): boolean {
    return this.state === MANUFACTURING
  }

  isCollecting(): boolean {
    return this.state === COLLECTING
  }

  isUpgrading(): boolean {
    return this.state === UPGRADING
  }

  isReinforced(): boolean {
    return this.state === REINFORCED
  }

  canRepair(): boolean {
    return (
      this.state === WORN || this.state === DAMAGED || this.state === DESTROYED
    )
  }

  canReinforce(): boolean {
    return this.state === OK
  }

  canUpgrade(): boolean {
    return this.state === OK || this.state === REINFORCED
  }

  canCollect(): boolean {
    return this.state === OK || this.state === REINFORCED
  }

  async getStateAfterDamage(damage: number): Promise<State> {
    if (this.state === REINFORCED) {
      return await State.getOKState()
    }

    const stateChange = Math.floor(damage / 10)
    if (stateChange === 0) {
      return this
    }
    let state = this.state
    for (let i = 0; i < stateChange; i++) {
      switch (state) {
        case OK:
          state = (await State.getWornState()).state
          break
        case WORN:
          state = (await State.getDamagedState()).state
          break
        case DAMAGED:
          state = (await State.getDestroyedState()).state
          break
      }
    }
    return (await State.findOne({ where: { state: state } })) as State
  }
}

export default (sequelize: Sequelize) => {
  State.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'State',
      tableName: 'State',
    }
  )

  return State
}
