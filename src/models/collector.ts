'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { Citadel } from './citadel'
import { State } from './state'
import { LevelCollector } from './level-collector'
import { RepairCollector } from './repair-collector'

export class Collector extends Model {
  public idCitadel!: number
  public idState!: number
  public idNextState!: number | null
  public level!: number
  public finishTime!: Date | null
  public health!: number
  public state?: State
  public levelCollector?: LevelCollector
  public repairCollector?: RepairCollector
  public citadel?: Citadel

  static associate(models: any) {
    Collector.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id',
      as: 'citadel',
    })
    Collector.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state',
    })
    Collector.hasOne(models.LevelCollector, {
      foreignKey: 'level',
      sourceKey: 'level',
      as: 'levelCollector',
    })
    Collector.hasOne(models.RepairCollector, {
      foreignKey: 'idStateFrom',
      sourceKey: 'idState',
      as: 'repairCollector',
    })
  }

  async updateCollector(db: any, date: Date) {
    if (!this.finishTime) {
      return
    }
    if (this.finishTime < date) {
      if (this.idState == (await db.State.getCollectingState()).id) {
        const yieldCollector = this.levelCollector!.yield
        await this.citadel!.addResources(yieldCollector)
      } else if (this.idState == (await db.State.getUpgradingState()).id) {
        this.level += 1
      }

      this.finishTime = null
      this.idState = this.idNextState!
      this.idNextState = null
      await this.save()
    }
  }

  async collect(db: any) {
    if (this.finishTime) {
      throw new Error('Collector busy')
    }
    const timeToCollect = this.levelCollector!.timeToCollect
    const [hours, minutes, seconds] = timeToCollect.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    this.idNextState = this.idState
    const collectingState = await db.State.getCollectingState()
    this.idState = collectingState.id

    await this.save()
  }

  async repair(db: any) {
    if (!this.state!.canRepair()) {
      throw new Error('Collector cannot be repaired')
    }
    if (this.citadel!.resources < this.repairCollector!.resources) {
      throw new Error('Not enough resources to repair')
    }
    if (this.citadel!.materials < this.repairCollector!.materials) {
      throw new Error('Not enough materials to repair')
    }

    this.citadel!.resources -= this.repairCollector!.resources
    this.citadel!.materials -= this.repairCollector!.materials
    await this.citadel!.save()

    const timeToRepair = this.repairCollector!.timeToRepair
    const [hours, minutes, seconds] = timeToRepair.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    const repairState = await db.State.getRepairingState()
    this.idState = repairState.id
    this.idNextState = this.repairCollector!.idStateTo

    await this.save()
  }

  async upgrade(db: any) {
    if (!this.state!.canUpgrade()) {
      throw new Error('Collector cannot be upgraded')
    }
    if (this.citadel!.resources < this.levelCollector!.upgradeResources) {
      throw new Error('Not enough resources to upgrade')
    }
    if (this.citadel!.materials < this.levelCollector!.upgradeMaterials) {
      throw new Error('Not enough materials to upgrade')
    }

    this.citadel!.resources -= this.levelCollector!.upgradeResources
    this.citadel!.materials -= this.levelCollector!.upgradeMaterials
    await this.citadel!.save()

    const timeToUpgrade = this.levelCollector!.timeToUpgrade
    const [hours, minutes, seconds] = timeToUpgrade.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    this.idNextState = this.idState
    const upgradeState = await db.State.getUpgradingState()
    this.idState = upgradeState.id

    await this.save()
  }
}

export default (sequelize: Sequelize) => {
  Collector.init(
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
      modelName: 'Collector',
      tableName: 'Collector',
    }
  )

  return Collector
}
