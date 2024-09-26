import { Model, DataTypes, Sequelize } from 'sequelize'
import { Collector } from './collector'
import { Factory } from './factory'
import { Player } from './player'

export class Citadel extends Model {
  public id?: number
  public name!: string
  public resources!: number
  public materials!: number
  public idPlayer!: number
  public collector?: Collector
  public factory?: Factory
  public player?: Player

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
  }

  public static async getCitadel(db: any, id: number) {
    return await db.Citadel.findByPk(id, {
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
        { model: db.Player, as: 'player' },
      ],
    })
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
    // TODO: citadel idle production
    const date = new Date()
    await this.player!.updatePlayer(db, date)
    await this.collector!.updateCollector(db, date) // TODO: collector state change by weather
    await this.factory!.updateFactory(db, date) // TODO: factory state change by weather
    await this.player!.updateWeatherOptions(db, this)
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
