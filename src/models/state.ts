'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

class State extends Model {
  public id!: number;
  public state!: string;

  static associate(models: any) { }

  static async getOKState(): Promise<State> {
    return await this.findOne({ where: { state: 'OK' } }) as State;
  }
}

export default (sequelize: Sequelize) => {
  State.init({
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
  }, {
    sequelize,
    modelName: 'State',
    tableName: 'State',
  });

  return State;
};