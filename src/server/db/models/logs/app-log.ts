import sequelize from "../../sequelize";
import { DataTypes } from 'sequelize'
import Log from "./log";

class APPLogClass extends Log {
    guildsAmount

    constructor() {
        super()

        this.guildsAmount = {
            type: DataTypes.NUMBER,
            allowNull: false,
        }
    }
}

const AppLog = sequelize.define('APILog', new APPLogClass(), { timestamps: false })

AppLog.sync()

export default AppLog