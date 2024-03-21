import { GuildLocation } from '../../db/models';
import { BadRequestError } from '../../errors';
import { InfoEmbed } from '../../utils/embeds';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDMPermission(false)
        .setDescription('See statistics for this server.'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        if (!interaction.guild) throw new BadRequestError('Not in server.');

        const locations = await GuildLocation.count({ where: { guildID: interaction.guild.id } });
        const memberCount = interaction.guild.memberCount;
        const percentage = Math.round((locations / memberCount) * 100);

        const embed = new InfoEmbed(
            'Statistics',
            `- ${locations} out of ${memberCount} members (${percentage}%) have set their location.`
        );

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
