import { CustomError, InternalServerError, NotFoundError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import v1Router from './api/v1/routers';
import sequelize from './db/sequelize'
require('express-async-errors')
import config from './config'
import { resolve } from 'path'
import express, {
	Application,
	NextFunction,
	Request,
	Response
} from 'express';

const client: CustomClient = new CustomClient({
    intents: [GatewayIntentBits.Guilds],
});

const app: Application = express();
app.set('discordClient', client);

app.use(express.static(resolve(__dirname, '../client/build')))
app.use('/api/v1/', v1Router)

app.use('/api/*', (req: Request, res: Response, next: NextFunction): void => {
	throw new NotFoundError('Route does not exist.')
})

app.get('/*', (req: Request, res: Response): void => {
	res.status(200).sendFile(resolve(__dirname, '../client/build/index.html'))
})

app.use((err: Error | CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.message)

	if (err instanceof CustomError) {
		res.status(err.statusCode).json({ error: err.message })
	} else {
		res.status(500).json({ error: 'Something went wrong!' })
	}
})

app.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));

try {
	sequelize.authenticate().then(() => console.log('connected to database...'))
} catch (error) {
	throw new InternalServerError('Could not connect to database.')
}