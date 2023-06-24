import wbs from 'winston-better-sqlite3'
import { resolve } from 'path'
import winston from 'winston'
import config from './config'

function createLogger(table: string, params: string[]) {
    const transport = new wbs({
        db: resolve(__dirname, '../../db.sqlite'),
        table: table,
        params: params
    })

    return winston.createLogger({
        levels: {
            'error': 0,
            'warn': 1,
            'info': 2,
        },
        format: winston.format.json(),
        transports: [
            config.mode === 'prod' ? transport : new winston.transports.Console()
        ]
    });
}

const apiLogger = createLogger('APILog', ['method', 'path', 'statusCode', 'responseTimeMS'])
const botLogger = createLogger('BotLog', ['type', 'name', 'statusCode'])
const appLogger = createLogger('AppLog', ['guildsAmount'])

export {
    apiLogger,
    botLogger,
    appLogger,
}