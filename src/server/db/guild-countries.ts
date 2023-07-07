import { InternalServerError } from "../errors";
import sequelize from "./sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize'

class GuildCountry extends Model<InferAttributes<GuildCountry>, InferCreationAttributes<GuildCountry>> {
    declare countryCode: string
    declare amount: number
}

class GuildCountries {
    declare private model: typeof GuildCountry

    constructor(guildID: string) {
        this.model = GuildCountry.init({
            countryCode: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            amount: {
                type: DataTypes.NUMBER,
            },
        }, {
            sequelize: sequelize,
            modelName: `${guildID}-Countries`,
            timestamps: false
        });
    }

    public sync() {
        return this.model.sync({ force: true })
    }

    public getGuildCountries() {
        return this.model.findAll()
    }

    public async increaseCountry(countryCode: string) {
        const country = await this.model.findOne({ where: { countryCode } })

        if (!country) {
            return this.model.create({ countryCode, amount: 1 })
        }

        return country.update({ amount: country.amount + 1 })
    }

    public async decreaseCountry(countryCode: string) {
        const country = await this.model.findOne({ where: { countryCode } })

        if (!country) return null
        
        if (country.amount <= 0) throw new InternalServerError('Invalid amount')

        country.update({ amount: country.amount - 1 })
    }
}

export default GuildCountries