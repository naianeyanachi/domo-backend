import { Model, DataTypes, Sequelize } from 'sequelize'
import { Collector } from './collector'
import { Factory } from './factory'
import { Player } from './player'
import { WeatherForecast } from './weather-forecast'

export class Citadel extends Model {
  public id?: number
  public name!: string
  public resources!: number
  public materials!: number
  public idPlayer!: number
  public collector?: Collector
  public factory?: Factory
  public player?: Player
  public weatherForecast?: WeatherForecast

  public static associate(models: any): void {
    Citadel.hasOne(models.Factory, {
      sourceKey: 'id',
      foreignKey: 'idCitadel',
      as: 'factory',
    })
    Citadel.hasOne(models.Collector, {
      sourceKey: 'id',
      foreignKey: 'idCitadel',
      as: 'collector',
    })
    Citadel.belongsTo(models.Player, {
      targetKey: 'id',
      foreignKey: 'idPlayer',
      as: 'player',
    })
    Citadel.hasOne(models.WeatherForecast, {
      sourceKey: 'id',
      foreignKey: 'idCitadel',
      as: 'weatherForecast',
    })
  }

  public static async getCitadel(db: any, id: number) {
    const citadel: Citadel | null = await db.Citadel.findByPk(id, {
      include: [
        {
          model: db.Collector,
          as: 'collector',
          include: [
            { model: db.State, as: 'state' },
            { model: db.LevelCollector, as: 'levelCollector' },
            { model: db.Citadel, as: 'citadel' },
            {
              model: db.RepairCollector,
              as: 'repairCollector',
              required: false,
            },
          ],
        },
        {
          model: db.Factory,
          as: 'factory',
          include: [
            { model: db.State, as: 'state' },
            { model: db.LevelFactory, as: 'levelFactory' },
            { model: db.Citadel, as: 'citadel' },
            { model: db.RepairFactory, as: 'repairFactory', required: false },
          ],
        },
        {
          model: db.WeatherForecast,
          as: 'weatherForecast',
          required: false,
          include: [
            { model: db.State, as: 'state' },
            { model: db.LevelWeatherForecast, as: 'levelWeatherForecast' },
            { model: db.Citadel, as: 'citadel' },
            {
              model: db.RepairWeatherForecast,
              as: 'repairWeatherForecast',
              required: false,
            },
          ],
        },
        { model: db.Player, as: 'player' },
      ],
    })
    // TODO: add weatherforecast if it isnt built yet
    // if can build weatherforecast, show Structure
    // else if cant build weatherforecast, null

    // TODO: add current weather
    return citadel
  }

  async addResources(resources: number) {
    this.resources += resources
    await this.save()
  }

  async addMaterials(materials: number) {
    this.materials += materials
    await this.save()
  }

  async updateCitadel(db: any) {
    const date = new Date()
    await this.idleProduction()
    await this.player!.updatePlayer(db, this, date)
    await this.collector!.updateCollector(db, date)
    await this.factory!.updateFactory(db, date)
    await this.player!.updateWeatherOptions(db, this)
  }

  async idleProduction() {
    const lastLogin = this.player!.lastLogin
    const timeSinceLastLogin = new Date().getTime() - lastLogin.getTime()
    const hoursSinceLastLogin = timeSinceLastLogin / (1000 * 60 * 60)
    const idleProduction = Math.round(hoursSinceLastLogin)
    await this.addResources(idleProduction)
  }
}

export default (sequelize: Sequelize) => {
  Citadel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      resources: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      materials: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      idPlayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: sequelize,
      modelName: 'Citadel',
      tableName: 'Citadel',
    }
  )

  return Citadel
}
