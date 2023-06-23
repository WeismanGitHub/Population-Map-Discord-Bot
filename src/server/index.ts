import { InternalServerError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import sequelize from './db/sequelize'
require('express-async-errors')
import config from './config'
import app from './app'

const client: CustomClient = new CustomClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

app.set('discordClient', client);
app.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));

try {
	sequelize.authenticate().then(() => console.log('connected to database...'))
} catch (error) {
	throw new InternalServerError('Could not connect to database.')
}