'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

class State extends Model {
  public id!: number;
  public state!: string;

  static associate(models: any) {
    State.hasMany(models.RepairCollector, {
      foreignKey: 'idStateFrom',
      sourceKey: 'id'
    });
    State.hasMany(models.RepairCollector, {
      foreignKey: 'idStateTo',
      sourceKey: 'id'
    });
    State.hasMany(models.RepairFactory, {
      foreignKey: 'idStateFrom',
      sourceKey: 'id'
    });
    State.hasMany(models.RepairFactory, {
      foreignKey: 'idStateTo',
      sourceKey: 'id'
    });
  }

  static async getOKState(): Promise<State> {
    return (await this.findOne({ where: { state: 'OK' } })) as State;
  }

  static async getRepairState(): Promise<State> {
    return (await this.findOne({ where: { state: 'REPAIRING' } })) as State;
  }

  static async getUpgradeState(): Promise<State> {
    return (await this.findOne({ where: { state: 'UPGRADING' } })) as State;
  }
}

export default (sequelize: Sequelize) => {
  State.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'State',
      tableName: 'State'
    }
  );

  return State;
};
