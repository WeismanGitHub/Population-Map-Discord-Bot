import sequelize from "../../sequelize";
import { DataTypes } from 'sequelize'
import Log from "./log";

class BotLogClass extends Log {
    type
    name
    statusCode

    constructor() {
        super()

        this.type = {
            type: DataTypes.ENUM('command', 'event'),
            allowNull: false,
        }

        this.name = {
            type: DataTypes.STRING,
            allowNull: false,
        }

        this.statusCode = {
            type: DataTypes.NUMBER,
            allowNull: false,
        }
    }
}

const BotLog = sequelize.define('BotLog', new BotLogClass(), { timestamps: false })

BotLog.sync()

export default BotLog
