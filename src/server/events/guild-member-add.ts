import { Events, GuildMember } from 'discord.js'

export default {
	name: Events.GuildMemberAdd,
	once: false,
	execute(member: GuildMember) {
	},
};
