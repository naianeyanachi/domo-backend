import { Model, DataTypes, Sequelize } from 'sequelize';

interface CitadelAttributes {
  id: number;
  name: string;
  resources: number;
  materials: number;
}

class Citadel extends Model<CitadelAttributes> implements CitadelAttributes {
  public id!: number;
  public name!: string;
  public resources!: number;
  public materials!: number;

  public static associate(models: any): void { }
}

export default (sequelize: Sequelize) => {
  Citadel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resources: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      materials: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Citadel',
    }
  );

  return Citadel;
};