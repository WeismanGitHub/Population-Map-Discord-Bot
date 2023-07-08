import { InternalServerError } from "../../errors";
import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Transaction
} from 'sequelize'

class GuildSubdivisions extends Model<InferAttributes<GuildSubdivisions>, InferCreationAttributes<GuildSubdivisions>> {
    declare subdivisionCode: string
    declare amount: number
}

class GuildCountry {
    declare private model: typeof GuildSubdivisions

    constructor(guildID: string, countryCode: string) {
        this.model = GuildSubdivisions.init({
            subdivisionCode: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            amount: {
                type: DataTypes.NUMBER,
                allowNull: false,
            },
        }, {
            sequelize: sequelize,
            modelName: `${guildID}-${countryCode}`,
            timestamps: false
        });
    }

    public sync() {
        return this.model.sync()
    }

    public getCountrySubdivisions() {
        return this.model.findAll()
    }

    public async increaseSubdivision(subdivisionCode: string, transaction: Transaction) {
        const subdivision = await this.model.findOne({ where: { subdivisionCode: subdivisionCode } })

        if (!subdivision) {
            return this.model.create({ subdivisionCode, amount: 1 }, { transaction })
        }

        return subdivision.update({ amount: subdivision.amount + 1 }, { transaction })
    }

    public async decreaseSubdivision(subdivisionCode: string, transaction: Transaction) {
        const subdivision = await this.model.findOne({ where: { subdivisionCode } })

        if (!subdivision) return null
        
        if (subdivision.amount <= 0) throw new InternalServerError('Invalid amount')

        subdivision.update({ amount: subdivision.amount - 1 }, { transaction })
    }
}

export default GuildCountry