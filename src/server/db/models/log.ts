import { DataTypes, InferAttributes, InferCreationAttributes, Model, ModelAttributes } from 'sequelize'
import sequelize from '../sequelize';


interface LogModel extends Model<InferAttributes<LogModel>, InferCreationAttributes<LogModel>> {
    level: 'error' | 'info'
    description: string | null
    timestamp: number
}

const x = function<M extends Model<any, any>>(modelName: string, attributes: ModelAttributes) {
    return sequelize.define<M>(modelName, attributes)
}

const y = x()
// class LogModel extends Model<InferAttributes<LogModel>, InferCreationAttributes<LogModel>> {
//     declare level: 'error' | 'info'

//     public static initialize(modelName: string, attributes: attributes) {
//         const baseAttributes = {
//             level: {
//                 type: DataTypes.ENUM('error', 'info'),
//                 allowNull: false
//             },
//             description: {
//                 type: DataTypes.STRING,
//                 allowNull: true
//             },
//             timestamp: {
//                 type: DataTypes.DATE,
//                 default: DataTypes.NOW
//             }
//         };

//         const model = this.init({ ...baseAttributes, ...attributes }, {
//             timestamps: false,
//             sequelize,
//             modelName,
//         });

//         model.sync()

//         return model
//     }
// }

export default LogModel
