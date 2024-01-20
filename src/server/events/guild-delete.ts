import { GuildLocation } from '../db/models';
import { Events, Guild } from 'discord.js';

export default {
    name: Events.GuildDelete,
    once: false,
    check: async (guild: Guild) => {
        return { guild };
    },
    execute: async ({ guild }: { guild: Guild }) => {
        await GuildLocation.destroy({ where: { guildID: guild.id } });
    },
};
