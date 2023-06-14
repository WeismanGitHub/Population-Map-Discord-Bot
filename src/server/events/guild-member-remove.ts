import { Events, GuildMember } from 'discord.js'

export default {
	name: Events.GuildMemberRemove,
	once: false,
	execute(member: GuildMember) {
		// if the user has location in server map then remove it from server map.
	},
};
