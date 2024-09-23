'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Citadel } from './citadel';
import { State } from './state';
import { LevelFactory } from './levelFactory';

export class Factory extends Model {
  public idCitadel!: number;
  public idState!: number;
  public idNextState!: number | null;
  public level!: number;
  public finishTime!: Date | null;
  public health!: number;
  public state?: State;
  public levelFactory?: LevelFactory;
  public citadel?: Citadel;

  static associate(models: any) {
    Factory.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id',
      as: 'citadel'
    });
    Factory.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state'
    });
    Factory.hasOne(models.LevelFactory, {
      foreignKey: 'level',
      sourceKey: 'level',
      as: 'levelFactory'
    });
  }

  async updateFactory(db: any) {
    if (!this.finishTime) {
      return;
    }
    if (this.finishTime < new Date()) {
      if (this.idState == (await db.State.getManufacturingState()).id) {
        const yieldFactory = this.levelFactory!.yield;
        await this.citadel!.addMaterials(yieldFactory);
      }

      this.finishTime = null;
      this.idState = this.idNextState!;
      this.idNextState = null;
      await this.save();
    }
  }

  async manufacture(db: any) {
    if (this.finishTime) {
      throw new Error('Factory busy');
    }
    if (this.citadel!.resources < this.levelFactory!.resources) {
      throw new Error('Not enough resources');
    }

    this.citadel!.resources -= this.levelFactory!.resources;
    await this.citadel!.save();

    const timeToManufactor = this.levelFactory!.timeToManufactor;
    const [hours, minutes, seconds] = timeToManufactor.split(':').map(Number);
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.finishTime = new Date(Date.now() + milliseconds);
    this.idNextState = this.idState;
    const manufacturingState = await db.State.getManufacturingState();
    this.idState = manufacturingState.id;

    await this.save();
  }
}

export default (sequelize: Sequelize) => {
  Factory.init(
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
      modelName: 'Factory',
      tableName: 'Factory'
    }
  );

  return Factory;
};
