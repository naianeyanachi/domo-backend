'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

class Factory extends Model {
  public idCitadel!: number;
  public idState!: number;
  public level!: number;
  public finishTime!: Date;
  public health!: number;

  static associate(models: any) {
    Factory.belongsTo(models.Citadel, { foreignKey: 'idCitadel' });
    Factory.belongsTo(models.State, { foreignKey: 'idState' });
    Factory.belongsTo(models.LevelFactory, { foreignKey: 'level' });
  }
}

export default (sequelize: Sequelize) => {
  Factory.init({
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
    modelName: 'Factory',
    tableName: 'Factory',
  });

  return Factory;
};