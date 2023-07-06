import { InternalServerError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import sequelize from './db/sequelize'
import logger from './logger';
require('express-async-errors')
import config from './config'
import app from './app'

(async function() {
	for (const entry of Object.entries(config)) {
		const [key, value] = entry
	
		if (Number.isNaN(value) || value === undefined) {
			throw new InternalServerError(`${key} is missing.`)
		}
	}
	
	if (!['prod', 'dev'].includes(config.mode)) {
		throw new InternalServerError('Mode must be equal to "prod" or "dev".')
	}
	
	const client = new CustomClient({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	});

	app.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));
	app.set('discordClient', client);
	
	await sequelize.authenticate()
	.catch((err) => { throw new InternalServerError('Could not connect to database.') })

	console.log('connected to database...')
})().then(() => {
	logger.info({
		statusCode: null,
		name: null,
		message: 'Successfully started app.',
		type: 'app'
	})
}).catch((err: Error) => {
	logger.fatal({
		message: 'Fatal error in index.js.',
		stack: err.stack,
		type: 'app'
	})
})