import { InternalServerError } from "../../errors";
import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Transaction
} from 'sequelize'

class GuildCountry extends Model<InferAttributes<GuildCountry>, InferCreationAttributes<GuildCountry>> {
    declare countryCode: string
    declare count: number
}

class GuildCountries {
    private readonly model: typeof GuildCountry
    public readonly guildID: string

    constructor(guildID: string) {
        this.guildID = guildID

        this.model = GuildCountry.init({
            countryCode: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize: sequelize,
            modelName: `${guildID}-Countries`,
            timestamps: false
        });
    }

    public sync() {
        return this.model.sync()
    }

    public getCountries() {
        return this.model.findAll()
    }

    public async increaseCountryCount(countryCode: string, transaction: Transaction) {
        const country = await this.model.findOne({ where: { countryCode } })

        if (!country) {
            return this.model.create({ countryCode, count: 1 }, { transaction })
        }

        return country.update({ count: country.count + 1 }, { transaction })
    }

    public async decreaseCountryCount(countryCode: string, transaction: Transaction) {
        const country = await this.model.findOne({ where: { countryCode } })

        if (!country) throw new InternalServerError('Cannot decrease country count.')
        
        if (country.count <= 0) throw new InternalServerError('Cannot decrease further.')

        country.update({ count: country.count - 1 }, { transaction })
    }
}

export default GuildCountries