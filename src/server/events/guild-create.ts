import { Guild, GuildMap } from '../db/models'
import Discord, { Events } from 'discord.js'

export default {
	name: Events.GuildCreate,
	once: false,
	async execute(guild: Discord.Guild) {
		const res = await Guild.upsert({ ID: guild.id })

		if (!res[1]) {
			await GuildMap.upsert({ ID: guild.id })
		}
	},
};
