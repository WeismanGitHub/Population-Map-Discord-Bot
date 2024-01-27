import sequelize from '../sequelize';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    declare guildID: string;
    declare visibility?:
        | 'public'
        | 'member-restricted'
        | 'map-role-restricted'
        | 'admin-role-restricted'
        | 'invisibile';
    declare mapRoleID: string | null;
    declare adminRoleID: string | null;
    declare userRoleID: string | null;
}

Guild.init(
    {
        guildID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        visibility: {
            type: DataTypes.ENUM(
                'public',
                'member-restricted',
                'map-role-restricted',
                'admin-role-restricted',
                'invisibile'
            ),
            defaultValue: 'public',
        },
        mapRoleID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        adminRoleID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userRoleID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sequelize,
        modelName: 'Guild',
        timestamps: false,
    }
);

Guild.sync();

export default Guild;
