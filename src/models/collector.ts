'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Citadel } from './citadel';

class Collector extends Model {
  public idCitadel!: number;
  public idState!: number;
  public level!: number;
  public finishTime!: Date | null;
  public health!: number;

  static associate(models: any) {
    Collector.belongsTo(models.Citadel, { foreignKey: 'idCitadel', targetKey: 'id', as: 'citadel' });
    Collector.hasOne(models.State, { foreignKey: 'id', sourceKey: 'idState', as: 'state' });
    Collector.hasOne(models.LevelCollector, { foreignKey: 'level', sourceKey: 'level' });
  }

  async collect(db: any, citadel: Citadel) {
    if (!this.finishTime) {
      return;
    }
    if (this.finishTime < new Date()) {
      this.finishTime = null
      await this.save()
      const yieldCollector = await db.LevelCollector.getYield(this.level)
      await citadel.addResources(yieldCollector)
    }
  }

  async start(db: any) {
    if (this.finishTime) {
      throw new Error('Collector already started');
    }
    const timeToCollect = await db.LevelCollector.getTimeToCollect(this.level)
    const [hours, minutes, seconds] = timeToCollect.split(':').map(Number);
    const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.finishTime = new Date(Date.now() + milliseconds);

    await this.save()
  }
}

export default (sequelize: Sequelize) => {
  Collector.init({
    idCitadel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
      type: DataTypes.TIME,
    },
    health: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Collector',
    tableName: 'Collector',
  });

  return Collector;
};