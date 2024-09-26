'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'

export class StructureRequirement extends Model {
  public idStructure!: number
  public idRequiredStructure!: number
  public level!: number

  static associate(models: any) {
    StructureRequirement.hasOne(models.Structure, {
      foreignKey: 'id',
      sourceKey: 'idStructure',
    })
    StructureRequirement.hasOne(models.Structure, {
      foreignKey: 'id',
      sourceKey: 'idRequiredStructure',
    })
  }
}

export default (sequelize: Sequelize) => {
  StructureRequirement.init(
    {
      idStructure: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idRequiredStructure: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StructureRequirement',
      tableName: 'StructureRequirement',
    }
  )

  return StructureRequirement
}