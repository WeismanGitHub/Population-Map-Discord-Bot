import config from './config';
import winston from 'winston';

interface LogInput {
    type: 'app' | 'api' | 'event' | 'command',
    message: string
}

class Logger {
    private logger: winston.Logger

    constructor() {
        const transport = config.mode === 'prod' ? new winston.transports.Console() : new winston.transports.Console()

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
            timestamp: Date.now(),
            ...log
        })
    }

    public error(log: LogInput & { stack: string | undefined }) {
        this.logger.log({
            level: 'error',
            timestamp: Date.now(),
            ...log
        })
    }

    public warn(log: LogInput) {
        this.logger.log({
            level: 'warn',
            timestamp: Date.now(),
            ...log
        })
    }

    public info(log: LogInput) {
        this.logger.log({
            level: 'info',
            timestamp: Date.now(),
            ...log
        })
    }
}

export default new Logger();
