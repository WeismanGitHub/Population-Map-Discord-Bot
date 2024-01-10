import { GuildLocation } from '../../db/models';
import { NotFoundError } from '../../errors';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove-location')
        .setDescription('Use this command in a server to remove your location from a server map.'),
    guildIDs: null,
    async execute(interaction: ChatInputCommandInteraction) {
        const locations = await GuildLocation.findAll({
            where: { userID: interaction.user.id },
            attributes: ['guildID'],
            limit: 25,
        });

        if (!locations.length) {
            throw new NotFoundError("You haven't set your location anywhere.");
        }

        const guilds = await Promise.all(
            locations.map((location) => {
                return interaction.client.guilds.fetch(location.guildID);
            })
        );

        const guildsMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'remove-location',
                        data: {},
                    })
                )
                .setPlaceholder('Select a server!')
                .addOptions(
                    guilds
                        .slice(0, 25)
                        .map((guild) =>
                            new StringSelectMenuOptionBuilder().setLabel(guild.name).setValue(guild.id)
                        )
                )
        );

        const pageButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setDisabled(guilds.length < 25)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'remove-location-page',
                        data: { page: 1 },
                    })
                )
        );

        interaction.reply({
            ephemeral: true,
            components: [guildsMenu, pageButtons],
        });
    },
};
