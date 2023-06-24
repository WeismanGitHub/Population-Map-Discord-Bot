import { AppLog, APILog, BotLog } from './db/models/logs';
import config from './config'

const levels = {
    'error': 0,
    'info': 2,
}

class Logger {
    // if config.mode is dev then console.log, otherwise save to db
    constructor() {

    }

    public log() {
        
    }
}

class APPLogger extends Logger {
}

class APILogger extends Logger {
}

class BotLogger extends Logger {
}


const botLogger = new BotLogger()
const apiLogger = new APILogger()
const appLogger = new APPLogger()

export {
    apiLogger,
    botLogger,
    appLogger,
}