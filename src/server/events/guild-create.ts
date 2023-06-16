import { Guild, GuildMap } from '../db/models'
import Discord, { Events } from 'discord.js'

export default {
	name: Events.GuildCreate,
	once: false,
	async execute(guild: Discord.Guild) {
	},
};
