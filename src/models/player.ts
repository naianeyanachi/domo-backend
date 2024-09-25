import { Model, DataTypes, Sequelize } from 'sequelize'

export class Player extends Model {
  public id!: number
  public email!: string
  public lastLogin!: Date

  public static associate(models: any): void {
    Player.hasOne(models.Citadel, {
      sourceKey: 'id',
      foreignKey: 'idPlayer',
      as: 'citadel',
    })
  }

  async updatePlayer(date: Date) {
    this.lastLogin = date
    await this.save()
  }
}

export default (sequelize: Sequelize) => {
  Player.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize: sequelize,
      modelName: 'Player',
      tableName: 'Player',
    }
  )

  return Player
}
