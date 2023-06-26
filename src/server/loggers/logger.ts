// import config from './config'

// class Logger {
    
//     constructor(LogModel: ModelStatic<Model<any, any>>) {
//         this.model = LogModel
//     }

//     // make it pass in whatever is required by this.model
//     public async log() {
//         console.log(this.model)
//         const log = this.model.build()
//         await log.validate()

//         config.mode === 'prod' ? await log.save() : console.log(log)
//     }
// }