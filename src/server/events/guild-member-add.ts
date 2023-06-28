import { Events, GuildMember } from 'discord.js'
import { User } from '../db/models'

export default {
	name: Events.GuildMemberAdd,
	logDescription: "Add user's location to a guild map on join.",
	once: false,
	async execute(member: GuildMember) {
		if (!member.user.bot) return
		
		const user = await User.findOne({ where: { discordID: member.id } })

		if (!user || !user.addLocationOnJoin) return

		// add the users location to the server map.
	},
};
