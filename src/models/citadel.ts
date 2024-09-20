import { Model, DataTypes, Sequelize } from 'sequelize';

class Citadel extends Model {
  public id?: number;
  public name!: string;
  public resources?: number;
  public materials?: number;

  public static associate(models: any): void {
    Citadel.hasOne(models.Factory, { sourceKey: 'id', foreignKey: 'idCitadel', as: 'factory' });
    Citadel.hasOne(models.Collector, { sourceKey: 'id', foreignKey: 'idCitadel', as: 'collector' });
  }
}

export default (sequelize: Sequelize) => {
  Citadel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      resources: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      materials: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize: sequelize,
      modelName: 'Citadel',
      tableName: 'Citadel',
    }
  );

  return Citadel;
};