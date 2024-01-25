import { GuildLocation } from '../db/models';
import { Events, Guild } from 'discord.js';

export default {
    name: Events.GuildDelete,
    once: false,
    check: async (guild: Guild) => guild,
    execute: async (guild: Guild) => {
        await GuildLocation.destroy({ where: { guildID: guild.id } });
    },
};