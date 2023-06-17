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
}, {
    sequelize: sequelize,
    modelName: 'ProcessLog',
    createdAt: true,
    updatedAt: false
});

AppLog.sync()

export default AppLog