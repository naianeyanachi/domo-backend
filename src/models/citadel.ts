import { Model, DataTypes, Sequelize } from 'sequelize';

interface CitadelAttributes {
  id?: number;
  name: string;
  resources?: number;
  materials?: number;
}

class Citadel extends Model<CitadelAttributes> implements CitadelAttributes {
  public id?: number;
  public name!: string;
  public resources?: number;
  public materials?: number;

  public static associate(models: any): void { }
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
    }
  );

  return Citadel;
};