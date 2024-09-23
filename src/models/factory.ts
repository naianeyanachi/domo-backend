'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Citadel } from './citadel';

export class Factory extends Model {
  public idCitadel!: number;
  public idState!: number;
  public level!: number;
  public finishTime!: Date | null;
  public health!: number;

  static associate(models: any) {
    Factory.belongsTo(models.Citadel, {
      foreignKey: 'idCitadel',
      targetKey: 'id'
    });
    Factory.hasOne(models.State, {
      foreignKey: 'id',
      sourceKey: 'idState',
      as: 'state'
    });
    Factory.hasOne(models.LevelFactory, {
      foreignKey: 'level',
      sourceKey: 'level'
    });
  }

  async manufacture(db: any, citadel: Citadel) {
    if (!this.finishTime) {
      return;
    }
    if (this.finishTime < new Date()) {
      this.finishTime = null;
      await this.save();
      const yieldFactory = await db.LevelFactory.getYield(this.level);
      await citadel.addMaterials(yieldFactory);
    }
  }

  async start(db: any) {
    if (this.finishTime) {
      throw new Error('Collector already started');
    }
    const timeToManufactor = await db.LevelFactory.getTimeToManufactor(
      this.level
    );
    const [hours, minutes, seconds] = timeToManufactor.split(':').map(Number);
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.finishTime = new Date(Date.now() + milliseconds);

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
