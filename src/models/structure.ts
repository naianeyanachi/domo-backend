'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export const COLLECTOR = 'Collector'
export const FACTORY = 'Factory'
export const WEATHER_FORECAST = 'WeatherForecast'
export const MACHINE_GUN_TURRET = 'MachineGunTurret'

export class Structure extends Model {
  public id!: number
  public structure!: string
  public buildResources!: number
  public buildMaterials!: number

  static associate(models: any) {
    Structure.hasMany(models.StructureRequirement, {
      sourceKey: 'id',
      foreignKey: 'idStructure',
    })
    Structure.hasMany(models.StructureRequirement, {
      sourceKey: 'id',
      foreignKey: 'idRequiredStructure',
    })
  }
}

export default (sequelize: Sequelize) => {
  Structure.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      structure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      buildResources: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      buildMaterials: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Structure',
      tableName: 'Structure',
    }
  )

  return Structure
}
