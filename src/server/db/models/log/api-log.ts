import { DataTypes, Model } from 'sequelize'
import sequelize from "../../sequelize";

class APILog extends Model {
    declare method: string
    declare path: string
    declare status: number
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
    status: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    responseTimeMS: {
        type: DataTypes.NUMBER,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    modelName: 'User',
    createdAt: true,
    updatedAt: false
});

APILog.sync()

export default APILog