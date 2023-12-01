import { InternalServerError } from "../../errors";
import sequelize from "../sequelize";
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Transaction
} from 'sequelize'

class CountrySubdivisions extends Model<InferAttributes<CountrySubdivisions>, InferCreationAttributes<CountrySubdivisions>> {
    declare subdivisionCode: string
    declare count: number
}

class GuildCountry {
    private readonly model: typeof CountrySubdivisions

    constructor(guildID: string, countryCode: string) {
        this.model = CountrySubdivisions.init({
            subdivisionCode: {
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
            modelName: `${guildID}-${countryCode}`,
            timestamps: false
        });
    }

    public sync() {
        return this.model.sync()
    }

    public getSubdivisions() {
        return this.model.findAll()
    }

    public async increaseSubdivisionCount(subdivisionCode: string, transaction: Transaction) {
        const subdivision = await this.model.findOne({ where: { subdivisionCode: subdivisionCode } })

        if (!subdivision) {
            return this.model.create({ subdivisionCode, count: 1 }, { transaction })
        }

        return subdivision.increment('count', { transaction })
    }

    public async decreaseSubdivisionCount(subdivisionCode: string, transaction: Transaction) {
        const subdivision = await this.model.findOne({ where: { subdivisionCode } })

        if (!subdivision) throw new InternalServerError('Cannot decrease subdivision count.')
        
        if (subdivision.count <= 0) throw new InternalServerError('Cannot decrease further.')

        return subdivision.decrement('count', { transaction })
    }
}

export default GuildCountry