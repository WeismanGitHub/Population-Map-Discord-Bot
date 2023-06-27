import { DataTypes } from 'sequelize'
import config from './config';
import { Log } from "./db/models";

interface LogInput {
    level: 'info' | 'error'
    description?: string | null
}

const log = async function(model: typeof Log, input: LogInput) {
    const log = model.build(input)

    if (config.mode === 'prod') {
        await log.save()
    } else {
        await log.validate()

        console.log(`  ${model.name} - ${new Date()}\n${Object.entries(input).map(([key, val]) => `    ${key}: ${val}`).join('\n')}`)
    }

    return log
}

interface AppInput extends LogInput {
    guildsAmount?: number | null
}

const appLog = (input: AppInput) => {
    const model = Log.initialize('AppLog', {
        guildsAmount: {
            allowNull: true,
            type: DataTypes.NUMBER,
        }
    })

    return log(model, input)
}

interface BotInput extends LogInput {
    type: 'command' | 'event'
    name: string
    statusCode: number
}

const botLog = (input: BotInput) => {
    const model = Log.initialize('AppLog', {
        type: {
            type: DataTypes.ENUM('command', 'event'),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        statusCode: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    })

    return log(model, input)
}

interface APIInput extends LogInput {
    method: string
    path: string
    statusCode: number
    responseTimeMS: number
}

const apiLog = (input: APIInput) => {
    const model = Log.initialize('AppLog', {
        method: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        statusCode: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        responseTimeMS: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    })

    return log(model, input)
}

export {
    appLog,
    botLog,
    apiLog,
}

