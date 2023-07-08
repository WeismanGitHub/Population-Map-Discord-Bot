import { InternalServerError } from "../../errors";
import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
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

    public async increaseCountry(subdivisionCode: string) {
        const subdivision = await this.model.findOne({ where: { subdivisionCode: subdivisionCode } })

        if (!subdivision) {
            return this.model.create({ subdivisionCode, amount: 1 })
        }

        return subdivision.update({ amount: subdivision.amount + 1 })
    }

    public async decreaseCountry(subdivisionCode: string) {
        const subdivision = await this.model.findOne({ where: { subdivisionCode } })

        if (!subdivision) return null
        
        if (subdivision.amount <= 0) throw new InternalServerError('Invalid amount')

        subdivision.update({ amount: subdivision.amount - 1 })
    }
}

export default GuildCountry