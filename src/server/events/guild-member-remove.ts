import { Events, GuildMember } from 'discord.js';
import { GuildLocation } from '../db/models';

export default {
    name: Events.GuildMemberRemove,
    once: false,
    check: async (member: GuildMember) => {
        return { member };
    },
    execute: async ({ member }: { member: GuildMember }) => {
        if (member.user.bot) return;

        await GuildLocation.destroy({ where: { guildID: member.guild.id, userID: member.user.id } });
    },
};
