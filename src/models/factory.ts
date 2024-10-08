'use strict'
import { Model, DataTypes, Sequelize, Op } from 'sequelize'
import { Citadel } from './citadel'
import { State } from './state'
import { LevelFactory } from './level-factory'
import { RepairFactory } from './repair-factory'
import { WeatherPlayer } from './weather-player'

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

  async updateFactory(db: any, date: Date) {
    if (!this.finishTime) {
      return
    }
    if (this.finishTime < date) {
      if (this.state!.isManufacturing()) {
        const yieldFactory = this.levelFactory!.yield
        await this.citadel!.addMaterials(yieldFactory)
      } else if (this.state!.isUpgrading()) {
        this.level += 1
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
    if (!this.state!.canRepair()) {
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
    const repairState = await db.State.getRepairingState()
    this.idState = repairState.id
    this.idNextState = this.repairFactory!.idStateTo

    await this.save()
  }

  async reinforce(db: any) {
    if (!this.state!.canReinforce()) {
      throw new Error('Factory cannot be reinforced')
    }
    if (this.citadel!.resources < this.repairFactory!.resources) {
      throw new Error('Not enough resources to reinforce')
    }
    if (this.citadel!.materials < this.repairFactory!.materials) {
      throw new Error('Not enough materials to reinforce')
    }

    this.citadel!.resources -= this.repairFactory!.resources
    this.citadel!.materials -= this.repairFactory!.materials
    await this.citadel!.save()

    const timeToReinforce = this.repairFactory!.timeToRepair
    const [hours, minutes, seconds] = timeToReinforce.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    const reinforceState = await db.State.getRepairingState()
    this.idState = reinforceState.id
    this.idNextState = this.repairFactory!.idStateTo

    await this.save()
  }

  async upgrade(db: any) {
    if (!this.state!.canUpgrade()) {
      throw new Error('Factory cannot be upgraded')
    }
    if (this.citadel!.resources < this.levelFactory!.upgradeResources) {
      throw new Error('Not enough resources to upgrade')
    }
    if (this.citadel!.materials < this.levelFactory!.upgradeMaterials) {
      throw new Error('Not enough materials to upgrade')
    }

    this.citadel!.resources -= this.levelFactory!.upgradeResources
    this.citadel!.materials -= this.levelFactory!.upgradeMaterials
    await this.citadel!.save()

    const timeToUpgrade = this.levelFactory!.timeToUpgrade
    const [hours, minutes, seconds] = timeToUpgrade.split(':').map(Number)
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000
    this.finishTime = new Date(Date.now() + milliseconds)
    this.idNextState = this.idState
    const upgradeState = await db.State.getUpgradingState()
    this.idState = upgradeState.id

    await this.save()
  }

  async applyWeather(db: any, idPlayer: number, date: Date) {
    if (this.finishTime && this.finishTime < date) {
      const weatherPlayer: WeatherPlayer = await db.WeatherPlayer.findOne({
        where: {
          idPlayer: idPlayer,
          datetimeEnd: {
            [Op.gte]: this.finishTime,
          },
          datetimeStart: {
            [Op.lte]: this.finishTime,
          },
        },
        include: [
          {
            model: db.Weather,
            as: 'weather',
            include: {
              model: db.State,
              as: 'worstState',
            },
          },
        ],
      })
      if (weatherPlayer.weather!.down > 0) {
        const reinforcedState = await db.State.getReinforcedState()
        const okState = await db.State.getOKState()
        if (this.idNextState! == reinforcedState.id) {
          this.idNextState = okState.id
        } else if (this.idNextState! < weatherPlayer.weather!.worstState!.id) {
          this.idNextState = weatherPlayer.weather!.worstState!.id
        }
        await this.save()
      }
    }
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
