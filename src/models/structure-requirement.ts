'use strict'
import { Model, DataTypes, Sequelize } from 'sequelize'
import { Structure } from './structure'

export class StructureRequirement extends Model {
  public idStructure!: number
  public idRequiredStructure!: number
  public level!: number
  public structure?: Structure | null
  public requiredStructure?: Structure | null

  static associate(models: any) {
    StructureRequirement.hasOne(models.Structure, {
      foreignKey: 'id',
      sourceKey: 'idStructure',
      as: 'structure',
    })
    StructureRequirement.hasOne(models.Structure, {
      foreignKey: 'id',
      sourceKey: 'idRequiredStructure',
      as: 'requiredStructure',
    })
  }
}

export default (sequelize: Sequelize) => {
  StructureRequirement.init(
    {
      idStructure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idRequiredStructure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
