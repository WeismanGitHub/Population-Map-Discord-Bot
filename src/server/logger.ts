import DailyRotateFile from 'winston-daily-rotate-file'
import config from './config';
import winston from 'winston';

interface LogInput {
    type: 'app' | 'api' | 'event' | 'command',
    message: string
}

class Logger {
    private logger: winston.Logger

    private generateBaseLog() {
        return {
            timestamp: Date.now(),
            ID: this.generateID()
        }
    }

    private generateID() {
        const randomNum = Math.floor(Math.random() * 100000)
        return `${Date.now()}-${randomNum}`;
    }

    constructor() {
        const transport = config.mode === 'dev' ? new winston.transports.Console() : new DailyRotateFile({
            level: 'info',
            filename: './logs/%DATE%.log',
            datePattern: 'YYYY-MM',
            zippedArchive: true,
        })

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

    public fatal(log: LogInput & { stack: string | undefined }) {
        this.logger.log({
            level: 'fatal',
            ...this.generateBaseLog(),
            ...log
        })
    }

    public error(log: LogInput & { stack: string | undefined }) {
        this.logger.log({
            level: 'error',
            ...this.generateBaseLog(),
            ...log
        })
    }

    public warn(log: LogInput) {
        this.logger.log({
            level: 'warn',
            ...this.generateBaseLog(),
            ...log
        })
    }

    public info(log: LogInput) {
        this.logger.log({
            level: 'info',
            ...this.generateBaseLog(),
            ...log
        })
    }
}

export default new Logger();
