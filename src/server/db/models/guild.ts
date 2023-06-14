import { DataTypes, Model } from 'sequelize'
import sequelize from "../sequelize";

class Guild extends Model {
    declare ID: string
    declare visibility: 'public' | 'member-restricted' | 'map-role-restricted' | 'admin-role-restricted' | 'invisibile'
    declare mapRoleID: string | null
    declare adminRoleID: string | null
}

Guild.init({
    ID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    visibility: {
        type: DataTypes.ENUM('public', 'member-restricted', 'map-role-restricted', 'admin-role-restricted', 'invisibile'),
        defaultValue: 'member-restricted'
    },
    mapRoleID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    adminRoleID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: sequelize,
    modelName: 'Guild',
    timestamps: false
});

Guild.sync()

export default Guild