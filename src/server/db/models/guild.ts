import { DataTypes, Model } from 'sequelize'
import sequelize from "../sequelize";

class Guild extends Model {
    declare ID: string
}

Guild.init({
    ID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize: sequelize,
    modelName: 'Guild',
    timestamps: false
});

Guild.sync()

export default Guild