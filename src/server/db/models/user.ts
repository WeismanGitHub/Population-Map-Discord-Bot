// @ts-nocheck
import { BadRequestError, InternalServerError } from "../../errors";
import GuildCountries from "./guild-countries";
import GuildCountry from "./guild-country";
import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Transaction
} from 'sequelize'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare discordID: string
    declare countryCode: string
    declare subdivisionCode?: string | null
    declare addLocationOnJoin?: boolean
    declare role?: 'regular' | 'admin'
    declare guildIDs?: string[]

    declare addLocationToGuild: (guildID: string, transaction?: Transaction) => Promise<void>
    declare removeLocationFromGuild: (guildID: string, transaction?: Transaction, commit: boolean=true) => Promise<void>
    declare updateLocation: (countryCode: string | null, subdivisionCode: string | null) => Promise<void>
    declare delete: () => Promise<void>
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
    },
    guildIDs: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '[]',
        get: function () {
            // @ts-ignore
            return JSON.parse(this.getDataValue('guildIDs'))
        },
        set: function(guildIDs: string[]) {
            // @ts-ignore
            this.setDataValue('guildIDs', JSON.stringify(guildIDs))
            return this.save()
        }
    }
}, {
    sequelize: sequelize,
    modelName: 'User',
    timestamps: false
});

User.prototype.addLocationToGuild = async function(guildID, transaction?: Transaction) {
    const guildIDs = this.guildIDs

    if (!guildIDs) {
        throw new InternalServerError('Could not get your servers.')
    }

    if (guildIDs.includes(guildID)) {
        throw new BadRequestError('You have already added your location to this server.')
    }

    const guildCountries = new GuildCountries(guildID)
    const guildCountry = this.subdivisionCode ? new GuildCountry(guildID, this.countryCode) : null

    if (guildCountry) await guildCountry.sync()
    transaction = transaction || await sequelize.transaction()

    try {
        await guildCountries.increaseCountryCount(this.countryCode, transaction)
        await this.update({ guildIDs: [...guildIDs, guildID] }, { transaction })
    
        if (guildCountry && this.subdivisionCode) {
            await guildCountry.increaseSubdivisionCount(this.subdivisionCode, transaction)
        }

        await transaction.commit()
    } catch(err) {
        await transaction.rollback()
        throw new InternalServerError('Could not save location to database.')
    }
}

User.prototype.removeLocationFromGuild = async function(guildID: string, transaction?: Transaction, commit: boolean=true) {
    const guildIDs = this.guildIDs

    if (!guildIDs || !guildIDs.includes(guildID)) {
        throw new BadRequestError('Your location has not been saved in this server.')
    }

    const guildCountries = new GuildCountries(guildID)
    const guildCountry = this.subdivisionCode ? new GuildCountry(guildID, this.countryCode) : null

    transaction = transaction || await sequelize.transaction()

    try {
        await guildCountries.decreaseCountryCount(this.countryCode, transaction)
        await this.update({ guildIDs: guildIDs.filter(id=> id !== guildID) }, { transaction })

        if (guildCountry && this.subdivisionCode) {
            await guildCountry.decreaseSubdivisionCount(this.subdivisionCode, transaction)
        }
        
        if (commit) await transaction.commit()
    } catch(err) {
        if (commit) await transaction.rollback()

        throw new InternalServerError('Could not remove location from database.')
    }
}

User.prototype.updateLocation = async function(countryCode: string | null, subdivisionCode: string | null) {
    const guildIDs = this.guildIDs

    if (!guildIDs) {
        return
    }

    await sequelize.transaction(async (transaction) => {
        await this.update({ countryCode }, { transaction })
        
        await Promise.all(guildIDs.map(guildID => {
            return this.removeLocationFromGuild(guildID, transaction)
        }))
        
        await Promise.all(guildIDs.map(guildID => {
            return this.addLocationToGuild(guildID, transaction)
        }))
    }).catch(err => { throw new InternalServerError('Could not update your location.') })

    const guildCountries = new GuildCountries(guildID)
    const guildCountry = this.subdivisionCode ? new GuildCountry(guildID, this.countryCode) : null

    await sequelize.transaction(async (transaction) => {
        await guildCountries.decreaseCountryCount(this.countryCode, transaction)
        await this.update({ guildIDs: guildIDs.filter(id=> id !== guildID) }, { transaction })

        if (guildCountry && this.subdivisionCode) {
            await guildCountry.decreaseSubdivisionCount(this.subdivisionCode, transaction)
        }
    }).catch(err => {
        throw new InternalServerError('Could not remove location from database.')
    })
}

User.prototype.delete = async function() {
    const guildIDs = this.guildIDs

    await sequelize.transaction(async (transaction) => {
        if (guildIDs) {
            await Promise.all(guildIDs.map(guildID => {
                return this.removeLocationFromGuild(guildID, transaction, false)
            }))
        }

        await this.destroy({ transaction })
    }).catch(err => {
        throw new InternalServerError('Could not delete your data.')
    })
}

User.sync()

export default User