import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize'

class PrivilegedUser extends Model<InferAttributes<PrivilegedUser>, InferCreationAttributes<PrivilegedUser>> {
    declare discordID: string
    declare type: 'admin'
}

PrivilegedUser.init({
    discordID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    type: {
        // Maybe make this an enum of all country codes in the future?
        type: DataTypes.ENUM('admin'),
        allowNull: false,
    },
}, {
    sequelize: sequelize,
    modelName: 'PrivilegedUser',
    timestamps: false
});

PrivilegedUser.sync()

export default PrivilegedUser