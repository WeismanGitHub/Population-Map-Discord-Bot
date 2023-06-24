import { DataTypes, Model } from 'sequelize'
import sequelize from "../../sequelize";

class AppLog extends Model {
    declare guildsAmount: number
}

AppLog.init({
    guildsAmount: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.NOW,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    modelName: 'AppLog',
    timestamps: false,
});

AppLog.sync()

export default AppLog