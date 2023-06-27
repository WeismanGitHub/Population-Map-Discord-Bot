import { InternalServerError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import sequelize from './db/sequelize'
import { appLog } from './loggers'
require('express-async-errors')
import config from './config'
import app from './app'

(async function() {
	const client = new CustomClient({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	});

	app.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));
	app.set('discordClient', client);
	
	await sequelize.authenticate()
	.catch((err) => { throw new InternalServerError('Could not connect to database.') })

	console.log('connected to database...')
	
	return (await client.guilds.fetch()).size
})().then(guildsAmount => {
	appLog({
		level: 'info',
		guilds: guildsAmount
	})
}).catch((err: Error) => {
	appLog({
		level: 'error',
		description: err.message
	})
})