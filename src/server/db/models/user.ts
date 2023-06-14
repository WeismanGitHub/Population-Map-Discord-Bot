import { DataTypes, Model } from 'sequelize'
import sequelize from "../sequelize";

class User extends Model {
    declare discordID: string
    declare countryCode: string | null
    declare subdivisionCode: string | null
    declare addLocationOnJoin: boolean
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
        allowNull: true,
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
    }
}, {
    sequelize: sequelize,
    modelName: 'User',
    timestamps: false
});

User.sync()

export default User