import { DataTypes, Model } from 'sequelize'
import sequelize from "../../sequelize";

class APILog extends Model {
    declare method: string
    declare path: string
    declare statusCode: number
    declare responseTimeMS: number
}

APILog.init({
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    statusCode: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    responseTimeMS: {
        type: DataTypes.NUMBER,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    modelName: 'APILog',
    createdAt: true,
    updatedAt: false
});

APILog.sync()

export default APILog