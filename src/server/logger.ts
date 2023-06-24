import wbs from 'winston-better-sqlite3'
import { resolve } from 'path'
import winston from 'winston'
import config from './config'

const wbsTransport = new wbs({
    db: resolve(__dirname, '../../db.sqlite'),
    table: 'log',
    params: ['level', 'resource', 'query', 'message']
})

export default winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        config.mode === 'prod' ? wbsTransport : new winston.transports.Console()
    ]
});
