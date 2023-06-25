import { DataTypes, Model } from 'sequelize'
import sequelize from '../../sequelize';

type attributes = {
    [key: string]: {
        type: unknown,
        allowNull: boolean
    };
}

class LogModel extends Model {
    public static async initialize(modelName: string, attributes: attributes) {
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
                type: DataTypes.NOW,
                allowNull: false,
            }
        };

        const model = this.init({ ...baseAttributes, ...attributes }, {
            timestamps: false,
            sequelize,
            modelName,
        });
        
        await this.sync()

        return model
    }
}

export default LogModel
