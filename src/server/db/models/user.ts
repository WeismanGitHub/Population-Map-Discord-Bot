import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare discordID: string
    declare countryCode: string
    declare subdivisionCode?: string | null
    declare addLocationOnJoin?: boolean
    declare role: 'regular' | 'admin'
}

User.init({
    discordID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    countryCode: {
        // Maybe make this an enum of all country codes in the future?
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: null,
    },
    subdivisionCode: {
        // Maybe make this an enum of all subdivision codes in the future?
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    addLocationOnJoin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM('regular', 'admin'),
        defaultValue: 'regular'
    }
}, {
    sequelize: sequelize,
    modelName: 'User',
    timestamps: false
});

User.sync()

export default User