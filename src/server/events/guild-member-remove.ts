import { Events, GuildMember } from 'discord.js'
import { Guild, User } from '../db/models';

export default {
	name: Events.GuildMemberRemove,
	once: false,
	check: async (member: GuildMember) => {
		return member
    },
    execute: async ({ member }: {
        member: GuildMember,
    }) => {
		if (!member.user.bot) return
		
		const user = await User.findOne({ where: { discordID: member.id } })

		if (!user) return

		const guild = await Guild.findOne({ where: { ID: member.guild.id }})

		if (!guild) return

		await user.removeLocationFromGuild(guild.ID)
	},
};
