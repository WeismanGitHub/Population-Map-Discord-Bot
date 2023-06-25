import { Model, ModelStatic } from 'sequelize';
import { AppLog } from './db/models/logs';
import config from './config'

class Logger {
    private model
    constructor(LogModel: ModelStatic<Model<any, any>>) {
        this.model = LogModel
    }

    // make it pass in whatever is required by this.model
    public async log() {
        const log = this.model.build()
        await log.validate()

        config.mode === 'prod' ? await log.save() : console.log(log)
    }
}

const appLogger = new Logger(AppLog)

export {
    appLogger,
}