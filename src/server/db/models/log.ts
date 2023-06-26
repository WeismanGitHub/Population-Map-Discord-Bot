import { DataTypes, Model } from 'sequelize'
import sequelize from '../sequelize';

type attributes = {
    [key: string]: {
        type: any,
        allowNull: boolean
    };
}

class LogModel extends Model {
    public static initialize(modelName: string, attributes: attributes) {
        const baseAttributes = {
            level: {
                type: DataTypes.ENUM('error', 'info'),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            timestamp: {
                type: DataTypes.DATE,
                default: DataTypes.NOW
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
