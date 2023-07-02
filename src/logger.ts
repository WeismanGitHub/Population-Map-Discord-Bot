import wbs from 'winston-better-sqlite3';
import config from './server/config';
import { resolve } from 'path';
import winston from 'winston';

type logType = 'app' | 'api' | 'event' | 'command'

class Logger {
    private logger: winston.Logger

    constructor(tableName: string, params: string[]) {
        const transport = config.mode === 'prod' ? new wbs({
            db: resolve(__dirname, '../../../db.sqlite'),
            table: tableName,
            params: params
        }) : new winston.transports.Console()

        this.logger = winston.createLogger({
            level: 'info',
            levels: {
                fatal: 0,
                error: 1,
                warn: 2,
                info: 3,
            },
            transports: [transport],
        });
    }

    public fatal(log: {
        type: logType,
        message: string,
        stack: string | undefined
    }) {
        this.logger.log({
            level: 'fatal',
            timestamp: Date.now(),
            ...log
        })
    }

    public error(log: {
        type: logType,
        message: string,
        stack: string | undefined
    }) {
        this.logger.log({
            level: 'error',
            timestamp: Date.now(),
            ...log
        })
    }

    public warn(log: {
        type: logType,
        message: string,
    }) {
        this.logger.log({
            level: 'warn',
            timestamp: Date.now(),
            ...log
        })
    }

    public info(log: {
        type: logType,
        message: string
    }) {
        this.logger.log({
            level: 'info',
            timestamp: Date.now(),
            ...log
        })
    }
}

export default new Logger('Logs', []);
