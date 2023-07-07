import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize'

class GuildMap extends Model<InferAttributes<GuildMap>, InferCreationAttributes<GuildMap>> {
    declare ID: string
}

GuildMap.init({
    ID: {
        type: DataTypes.BIGINT,
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