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
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
}, {
    indexes: [{
            fields: ['ID']
    }],
    sequelize: sequelize,
    modelName: 'GuildMap',
    timestamps: false
});

GuildMap.sync()

export default GuildMap