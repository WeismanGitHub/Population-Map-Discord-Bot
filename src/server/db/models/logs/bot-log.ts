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
    timestamp: {
        type: DataTypes.NOW,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    modelName: 'BotLog',
    timestamps: false
});

BotLog.sync()

export default BotLog
