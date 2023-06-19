import { DataTypes, Model } from 'sequelize'
import sequelize from "../sequelize";

class GuildMap extends Model {
    declare ID: string
}

GuildMap.init({
    ID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize: sequelize,
    modelName: 'GuildMap',
    timestamps: false
});

GuildMap.sync()

export default GuildMap