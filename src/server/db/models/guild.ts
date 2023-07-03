import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize'

class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    declare ID: string
    declare visibility?: 'public' | 'member-restricted' | 'map-role-restricted' | 'admin-role-restricted' | 'invisibile'
    declare mapRoleID: string | null
    declare adminRoleID: string | null
}

Guild.init({
    ID: {
        type: DataTypes.BIGINT,
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