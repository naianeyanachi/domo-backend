import { Model, DataTypes, Sequelize, Op } from 'sequelize'
import { COLLECTOR, FACTORY } from './structure'
import { Citadel } from './citadel'
import { WeatherRequirement } from './weather-requirement'
import { WeatherPlayerOption } from './weather-player-options'
import { NORMAL } from './weather'
import { WeatherPlayer } from './weather-player'

export class Player extends Model {
  public id!: number
  public email!: string
  public lastLogin!: Date

  public static associate(models: any): void {
    Player.hasOne(models.Citadel, {
      sourceKey: 'id',
      foreignKey: 'idPlayer',
      as: 'citadel',
    })
    Player.hasMany(models.WeatherPlayer, {
      sourceKey: 'id',
      foreignKey: 'idPlayer',
      as: 'weatherPlayer',
    })
  }

  async updatePlayer(db: any, citadel: Citadel, date: Date) {
    await this.generateWeatherPlayer(db, date)
    await this.applyWeather(db, citadel, date)
    this.lastLogin = date
    await this.save()
  }

  async generateWeatherPlayer(db: any, date: Date) {
    const lastWeatherPlayer: WeatherPlayer = await db.WeatherPlayer.findOne({
      where: {
        idPlayer: this.id,
      },
      order: [['datetimeEnd', 'DESC']],
    })
    let lastDate = lastWeatherPlayer?.datetimeEnd
    if (date < lastDate) {
      return
    }
    if (!lastDate) {
      lastDate = this.lastLogin
    }
    const unlockedWeathers: WeatherPlayerOption[] =
      await db.WeatherPlayerOption.findAll({
        where: {
          idPlayer: this.id,
        },
        include: [
          {
            model: db.Weather,
            as: 'weather',
          },
        ],
      })
    const unlockedNotNormalWeathers = unlockedWeathers.filter(
      (weather: any) => weather.weather.weather !== NORMAL
    )
    const weatherChances: { [key: number]: number } =
      unlockedNotNormalWeathers.reduce(
        (acc: { [key: number]: number }, weather: any) => {
          acc[weather.idWeather] = weather.weather.percentageChance
          return acc
        },
        {}
      )
    while (lastDate <= date) {
      const totalChance = 100
      const randomNumber = Math.random() * totalChance

      let selectedWeather = 1
      let accumulatedChance = 0

      for (const [idWeather, chance] of Object.entries(weatherChances)) {
        accumulatedChance += chance
        if (randomNumber <= accumulatedChance) {
          selectedWeather = parseInt(idWeather)
          break
        }
      }
      const minDuration = unlockedWeathers.find(
        weather => weather.idWeather === selectedWeather
      )!.weather!.minDuration
      const [hours, minutes, seconds] = minDuration.split(':').map(Number)
      const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000

      const randomMultiplier = 1 + Math.random() * 4
      const duration = Math.floor(milliseconds * randomMultiplier)
      const datetimeEnd = new Date(lastDate.getTime() + duration)
      await db.WeatherPlayer.create({
        idPlayer: this.id,
        idWeather: selectedWeather,
        datetimeStart: lastDate,
        datetimeEnd: datetimeEnd,
      })
      lastDate = datetimeEnd
    }
  }

  async updateWeatherOptions(db: any, citadel: Citadel) {
    const weatherPlayerOptions = await db.WeatherPlayerOption.findAll({
      where: {
        idPlayer: this.id,
      },
    })
    const allWeathers = await db.Weather.findAll()
    const weathers = allWeathers.filter((weather: any) => {
      return !weatherPlayerOptions.some(
        (option: any) => option.idWeather === weather.id
      )
    })
    const requirements = await db.WeatherRequirement.findAll({
      where: {
        idWeather: {
          [Op.in]: weathers.map((weather: any) => weather.id),
        },
      },
      include: [
        {
          model: db.Structure,
          as: 'structure',
        },
        {
          model: db.Weather,
          as: 'weather',
        },
      ],
    })
    const groupedRequirements: { [key: number]: WeatherRequirement[] } =
      requirements.reduce(
        (
          acc: { [key: number]: WeatherRequirement[] },
          requirement: WeatherRequirement
        ) => {
          if (!acc[requirement.idWeather]) {
            acc[requirement.idWeather] = []
          }
          acc[requirement.idWeather].push(requirement)
          return acc
        },
        {}
      )

    for (const [idWeather, weatherRequirements] of Object.entries(
      groupedRequirements
    )) {
      let unlock = false
      for (const requirement of weatherRequirements) {
        switch (requirement.structure.structure) {
          case COLLECTOR:
            unlock = unlock || citadel.collector!.level >= requirement.level
            break
          case FACTORY:
            unlock = unlock || citadel.factory!.level >= requirement.level
            break
        }
      }

      if (unlock) {
        await db.WeatherPlayerOption.create({
          idPlayer: this.id,
          idWeather: idWeather,
        })
      }
    }
  }

  async applyWeather(db: any, citadel: Citadel, date: Date) {
    await citadel.collector!.applyWeather(db, this.id, date)
    await citadel.factory!.applyWeather(db, this.id, date)
  }
}

export default (sequelize: Sequelize) => {
  Player.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize: sequelize,
      modelName: 'Player',
      tableName: 'Player',
    }
  )

  return Player
}
