import { GuildEmbed } from '../../utils/embeds';
import config from '../../config';
import {
    SlashCommandBuilder,
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('See the servers this bot is in.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    guildIDs: [config.supportServerID],
    async execute(interaction: CommandInteraction) {
        const guildEmbeds = interaction.client.guilds.cache.first(10).map((guild) => new GuildEmbed(guild));

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setDisabled(guildEmbeds.length < 10)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'servers-page',
                        data: { page: 1 },
                    })
                )
        );

        await interaction.reply({
            ephemeral: true,
            embeds: guildEmbeds,
            components: [buttonsRow],
        });
    },
};
