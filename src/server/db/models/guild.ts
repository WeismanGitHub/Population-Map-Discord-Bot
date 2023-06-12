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
    visibility: {
        type: DataTypes.ENUM('public', 'member-restricted', 'map-role-restricted', 'admin-role-restricted', 'invisibile'),
        defaultValue: 'member-restricted'
    }
}, {
    sequelize: sequelize,
    modelName: 'Guild',
    timestamps: false
});

Guild.sync()

export default Guild