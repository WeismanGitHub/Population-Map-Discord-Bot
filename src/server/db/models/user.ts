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
    declare role?: 'regular' | 'admin'
    declare guildIDs?: string[]
}

User.init({
    discordID: {
        type: DataTypes.BIGINT,
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
    },
    guildIDs: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '[]',
        get: function () {
            // @ts-ignore
            return JSON.parse(this.getDataValue('guildIDs'))
        },
        set: function(guildID: string) {
            const guildIDs = [
                // @ts-ignore
                ...this.getDataValue('guildIDs') ? JSON.parse(this.getDataValue('guildIDs')) : [],
                ...guildID ? [guildID] : []
            ]
            console.log(guildIDs)
            // @ts-ignore
            return this.setDataValue('guildIDs', JSON.stringify(guildIDs))
        }
    }
}, {
    sequelize: sequelize,
    modelName: 'User',
    timestamps: false
});

User.sync()

export default User