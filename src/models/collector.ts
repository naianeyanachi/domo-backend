'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

class Collector extends Model {
  public idCitadel!: number;
  public idState!: number;
  public level!: number;
  public finishTime!: Date;
  public health!: number;

  static associate(models: any) {
    Collector.belongsTo(models.Citadel, { foreignKey: 'idCitadel' });
    Collector.belongsTo(models.State, { foreignKey: 'idState' });
    Collector.belongsTo(models.LevelCollector, { foreignKey: 'level' });
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