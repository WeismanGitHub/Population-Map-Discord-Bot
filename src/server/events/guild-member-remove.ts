import { Events, GuildMember } from 'discord.js'

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

		console.log(member)
		// if the user has location in server map then remove it from server map.
	},
};
