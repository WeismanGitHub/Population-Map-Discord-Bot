import sequelize from '../sequelize';
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    ModelAttributes
} from 'sequelize'

// I've completely butchered all this logging stuff.
// TODO: Make an extendable Log model with Typescript type annotation stuff or whatever it's called.
class LogModel extends Model<InferAttributes<LogModel>, InferCreationAttributes<LogModel>> {
    declare level: 'error' | 'info'
    declare description: string | null

    public static initialize(modelName: string, attributes: ModelAttributes) {
        const baseAttributes = {
            level: {
                type: DataTypes.ENUM('error', 'info'),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        };

        const model = this.init({ ...baseAttributes, ...attributes }, {
            timestamps: false,
            sequelize,
            modelName,
        });

        model.sync()

        return model
    }
}

export default LogModel
