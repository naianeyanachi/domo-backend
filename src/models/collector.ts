'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Citadel } from './citadel';
import { State } from './state';
import { LevelCollector } from './levelCollector';
import { RepairCollector } from './repairCollector';

export class Collector extends Model {
  public idCitadel!: number;
  public idState!: number;
  public idNextState!: number | null;
  public level!: number;
  public finishTime!: Date | null;
  public health!: number;
  public state?: State;
  public levelCollector?: LevelCollector;
  public repairCollector?: RepairCollector;
  public citadel?: Citadel;

  static associate(models: any) {
    Collector.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id',
      as: 'citadel'
    });
    Collector.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state'
    });
    Collector.hasOne(models.LevelCollector, {
      foreignKey: 'level',
      sourceKey: 'level',
      as: 'levelCollector'
    });
    Collector.hasOne(models.RepairCollector, {
      foreignKey: 'idStateFrom',
      sourceKey: 'idState',
      as: 'repairCollector'
    });
  }

  async updateCollector(db: any) {
    if (!this.finishTime) {
      return;
    }
    if (this.finishTime < new Date()) {
      if (this.idState == (await db.State.getCollectingState()).id) {
        const yieldCollector = this.levelCollector!.yield;
        await this.citadel!.addResources(yieldCollector);
      }

      this.finishTime = null;
      this.idState = this.idNextState!;
      this.idNextState = null;
      await this.save();
    }
  }

  async collect(db: any) {
    if (this.finishTime) {
      throw new Error('Collector busy');
    }
    const timeToCollect = this.levelCollector!.timeToCollect;
    const [hours, minutes, seconds] = timeToCollect.split(':').map(Number);
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.finishTime = new Date(Date.now() + milliseconds);
    this.idNextState = this.idState;
    const collectingState = await db.State.getCollectingState();
    this.idState = collectingState.id;

    await this.save();
  }

  async repair(db: any) {
    const repairState = await db.State.getRepairingState();
    if (this.idState == repairState.id) {
      throw new Error('Collector is already repairing');
    }
    if (!this.state?.canRepair()) {
      throw new Error('Collector cannot be repaired');
    }
    if (this.citadel!.resources < this.repairCollector!.resources) {
      throw new Error('Not enough resources to repair');
    }
    if (this.citadel!.materials < this.repairCollector!.materials) {
      throw new Error('Not enough materials to repair');
    }

    this.citadel!.resources -= this.repairCollector!.resources;
    this.citadel!.materials -= this.repairCollector!.materials;
    await this.citadel!.save();

    const timeToRepair = this.repairCollector!.timeToRepair;
    const [hours, minutes, seconds] = timeToRepair.split(':').map(Number);
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.finishTime = new Date(Date.now() + milliseconds);
    this.idState = repairState.id;
    this.idNextState = this.repairCollector!.idStateTo;

    await this.save();
  }
}

export default (sequelize: Sequelize) => {
  Collector.init(
    {
      idCitadel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      idState: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      idNextState: {
        type: DataTypes.INTEGER,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      finishTime: {
        type: DataTypes.TIME
      },
      health: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Collector',
      tableName: 'Collector'
    }
  );

  return Collector;
};
