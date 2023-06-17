import { DataTypes, Model } from 'sequelize'
import sequelize from "../../sequelize";

class BotLog extends Model {
    declare type: 'command' | 'event'
    declare name: string
    declare statusCode: number
}

BotLog.init({
    type: {
        type: DataTypes.ENUM('command', 'event'),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    statusCode: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
}, {
    sequelize: sequelize,
    modelName: 'BotLog',
    createdAt: true,
    updatedAt: false
});

BotLog.sync()

export default BotLog