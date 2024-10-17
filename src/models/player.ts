import { Model, DataTypes, Sequelize, Op } from 'sequelize'
import { StructureType } from './structure'
import { Citadel } from './citadel'
import { WeatherRequirement } from './weather-requirement'
import { WeatherPlayerOption } from './weather-player-options'
import { WeatherType } from './weather'
import { WeatherPlayer } from './weather-player'
import { EnemyType } from './enemy'
import { HordeEnemy } from './horde-enemy'
import { State } from './state'

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
    await this.generateHorde(db, citadel, date)
    await this.hordeBattle(db, citadel, date)
    this.lastLogin = date
    await this.save()
  }

  async generateWeatherPlayer(db: any, date: Date) {
    const maxLevel = await db.WeatherForecast.findOne({
      attributes: [
        [db.Sequelize.fn('MAX', db.Sequelize.col('level')), 'maxLevel'],
      ],
      include: [
        {
          attributes: [],
          model: db.Citadel,
          as: 'citadel',
          include: [
            {
              attributes: [],
              model: db.Player,
              as: 'player',
              where: {
                id: this.id,
              },
            },
          ],
        },
      ],
      group: [db.Sequelize.col('citadel.id')],
    })

    if (maxLevel?.maxLevel) {
      const levelWeatherForecast = await db.LevelWeatherForecast.findOne({
        where: {
          level: maxLevel.maxLevel,
        },
      })

      const milliseconds =
        levelWeatherForecast.forecastDays * 24 * 60 * 60 * 1000
      date = new Date(date.getTime() + milliseconds)
    }

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
      (weather: any) => weather.weather.weather !== WeatherType.NORMAL
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
          case StructureType.COLLECTOR:
            unlock = unlock || citadel.collector!.level >= requirement.level
            break
          case StructureType.FACTORY:
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

  async generateHorde(db: any, citadel: Citadel, date: Date) {
    const horde = await db.Horde.findOne({
      where: {
        idCitadel: citadel.id,
      },
      order: [['datetime', 'DESC']],
    })
    const lastHordeDate = horde?.datetime
    if (lastHordeDate && lastHordeDate > date) {
      return
    }

    const random = Math.random() * 10
    const nextHordeDate = new Date(
      date.getTime() + 10 * 60 * 60 * 1000 + random * 60 * 60 * 1000
    )
    const newHorde = await db.Horde.create({
      idCitadel: citadel.id,
      datetime: nextHordeDate,
    })
    const numCitadel = await db.Citadel.count({
      where: {
        idPlayer: this.id,
      },
    })

    const enemyTypes = []
    if (citadel.machineGunTurret) {
      enemyTypes.push(EnemyType.TERRESTRIAL)
    }
    // TODO: check for other types of enemies

    if (enemyTypes.length === 0) {
      return
    }

    const enemies = await db.Enemy.findAll({
      where: {
        type: {
          [Op.in]: enemyTypes,
        },
      },
    })

    const structures = await db.Structure.findAll()
    const targetableStructures = []
    for (const structure of structures) {
      switch (structure.structure) {
        case StructureType.COLLECTOR:
          if (citadel.collector) {
            targetableStructures.push(structure.id)
          }
          break
        case StructureType.FACTORY:
          if (citadel.factory) {
            targetableStructures.push(structure.id)
          }
          break
        case StructureType.WEATHER_FORECAST:
          if (citadel.weatherForecast) {
            targetableStructures.push(structure.id)
          }
          break
        case StructureType.MACHINE_GUN_TURRET:
          if (citadel.machineGunTurret) {
            targetableStructures.push(structure.id)
          }
          break
      }
    }

    const numHordeEnemies = Math.floor(Math.random() * 2 * numCitadel) + 1
    for (let i = 0; i < numHordeEnemies; i++) {
      const enemy = enemies[Math.floor(Math.random() * enemies.length)]
      const attack =
        Math.floor(Math.random() * (enemy.attackHigh - enemy.attackLow)) +
        enemy.attackLow
      const life =
        Math.floor(Math.random() * (enemy.lifeHigh - enemy.lifeLow)) +
        enemy.lifeLow
      const defense =
        Math.floor(Math.random() * (enemy.defenseHigh - enemy.defenseLow)) +
        enemy.defenseLow
      const targetStructure =
        targetableStructures[
          Math.floor(Math.random() * targetableStructures.length)
        ]
      await db.HordeEnemy.create({
        idHorde: newHorde.id,
        idEnemy: enemy.id,
        attack: attack,
        life: life,
        defense: defense,
        idTargetStructure: targetStructure,
      })
    }
  }

  async hordeBattle(db: any, citadel: Citadel, date: Date) {
    if (!citadel.horde) {
      return
    }
    if (citadel.horde!.datetime > date) {
      return
    }
    if (citadel.horde!.logs && citadel.horde!.logs!.length !== 0) {
      return
    }

    let totalAttack: { [key: string]: number } = {}
    for (const enemyType of Object.values(EnemyType)) {
      totalAttack[enemyType] = 0
    }

    if (citadel.machineGunTurret) {
      totalAttack[EnemyType.TERRESTRIAL] +=
        citadel.machineGunTurret.levelMachineGunTurret!.attack
    }
    // TODO: check for other defenses

    for (const enemy of citadel.horde!.enemies!) {
      const enemyTrueLife = enemy.life + enemy.defense
      if (totalAttack[enemy.enemy!.type] < enemy.defense) {
        continue
      } else if (totalAttack[enemy.enemy!.type] > enemyTrueLife) {
        totalAttack[enemy.enemy!.type] -= enemyTrueLife
        enemy.life = 0
        enemy.attack = 0
      } else {
        const enemyLifeAfterAttack =
          enemyTrueLife - totalAttack[enemy.enemy!.type]
        enemy.attack = Math.floor(
          enemy.attack * (enemyLifeAfterAttack / enemy.life)
        )
        enemy.life = enemyLifeAfterAttack
      }
      enemy.save()
    }

    const enemiesAlive = citadel.horde!.enemies!.filter(
      (enemy: HordeEnemy) => enemy.life > 0
    )

    for (const enemy of enemiesAlive) {
      let damage = enemy.attack
      let newState: State
      let oldState: State

      switch (enemy.targetStructure!.structure) {
        case StructureType.MACHINE_GUN_TURRET:
          damage -= citadel.machineGunTurret!.levelMachineGunTurret!.defense
          if (damage < 0) {
            damage = 0
          }
          oldState = citadel.machineGunTurret!.state!
          newState =
            await citadel.machineGunTurret!.state!.getStateAfterDamage(damage)!
          break
        case StructureType.COLLECTOR:
          oldState = citadel.collector!.state!
          newState =
            await citadel.collector!.state!.getStateAfterDamage(damage)!
          break
        case StructureType.FACTORY:
          oldState = citadel.factory!.state!
          newState = await citadel.factory!.state!.getStateAfterDamage(damage)!
          break
        case StructureType.WEATHER_FORECAST:
          oldState = citadel.weatherForecast!.state!
          newState =
            await citadel.weatherForecast!.state!.getStateAfterDamage(damage)!
          break
      }

      db.HordeLog.create({
        idHorde: citadel.horde!.id,
        idStructure: enemy.targetStructure!.id,
        idStateFrom: oldState!.id,
        idStateTo: newState!.id,
      })
    }
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
