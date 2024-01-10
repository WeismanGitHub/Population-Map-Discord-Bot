import sequelize from '../sequelize';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import User from './user';
import Guild from './guild';

class GuildLocation extends Model<InferAttributes<GuildLocation>, InferCreationAttributes<GuildLocation>> {
    declare userID: string;
    declare guildID: string;
    declare countryCode: string;
    declare subdivisionCode: string | null;
}

GuildLocation.init(
    {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        guildID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subdivisionCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sequelize,
        modelName: 'GuildLocation',
        timestamps: false,
    }
);

User.hasMany(GuildLocation, { foreignKey: 'userID', sourceKey: 'userID' });
GuildLocation.belongsTo(User, { foreignKey: 'userID', targetKey: 'userID' });

Guild.hasMany(GuildLocation, { foreignKey: 'guildID', sourceKey: 'guildID' });
GuildLocation.belongsTo(Guild, { foreignKey: 'guildID', targetKey: 'guildID' });

GuildLocation.sync();

export default GuildLocation;
