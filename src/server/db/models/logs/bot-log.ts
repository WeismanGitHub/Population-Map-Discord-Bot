import sequelize from '../../sequelize';
import config from '../../../config';
import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from 'sequelize'

interface Input {
    level: 'error' | 'info'
    description?: string | null
    guildsAmount?: number | null
}

class AppLogModel extends Model {
    declare level: 'error' | 'info'
    declare description: string | null
    declare guildsAmount: number | null
    declare log: (input: Input) => Promise<void>
}

const AppLog = sequelize.define<Model<InferAttributes<AppLogModel>, InferCreationAttributes<AppLogModel>>>('AppLog', {
    level: {
        type: DataTypes.ENUM('error', 'info'),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    guildsAmount: {
        type: DataTypes.NUMBER,
        allowNull: true
    }
}, {
    createdAt: true,
    updatedAt: false
});

AppLog.sync()
// @ts-ignore
AppLog.log = async function(input: Input) {
    const log = AppLog.build(input)

    if (config.mode === 'dev') {
        await log.validate()
        console.log(log)
    } else {
        await log.save()
    }

    return log
}

export default AppLog
