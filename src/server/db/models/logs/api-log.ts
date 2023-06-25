import sequelize from "../../sequelize";
import { DataTypes } from 'sequelize'
import Log from "./log";

class APILogClass extends Log {
    method
    path
    statusCode
    responseTimeMS

    constructor() {
        super()

        this.method = {
            type: DataTypes.STRING,
            allowNull: false,
        }

        this.path = {
            type: DataTypes.STRING,
            allowNull: false,
        }
        
        this.statusCode = {
            type: DataTypes.NUMBER,
            allowNull: false,
        }

        this.responseTimeMS = {
            type: DataTypes.NUMBER,
            allowNull: false,
        }
    }
}

const APILog = sequelize.define('APILog', new APILogClass(), {
    timestamps: false
})

APILog.sync()

export default APILog