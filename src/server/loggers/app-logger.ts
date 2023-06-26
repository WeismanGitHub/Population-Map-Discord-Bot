import { DataTypes } from 'sequelize'
import { Log } from "../db/models";

const AppLog = Log.initialize('AppLog', {
    guildsAmount: {
        allowNull: true,
        type: DataTypes.NUMBER,
    }
})

class AppLogger {
    constructor() {
        console.log('test', AppLog.getAttributes())
    }

    public async log(input: object) {
        const log = await AppLog.create({
            level: 'info',
            description: 'test',
        })
    }
}

const appLogger = new AppLogger()

export default appLogger

