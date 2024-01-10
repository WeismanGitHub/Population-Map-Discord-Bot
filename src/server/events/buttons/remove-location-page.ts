import { GuildLocation } from '../../db/models';
import { NotFoundError } from '../../errors';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Events,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const customID: CustomID<{ page: number }> = JSON.parse(interaction.customId);
        const { type } = customID;

        if (type !== 'remove-location-page') {
            return;
        }

        return { customID: customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{ page: number }>;
    }) => {
        const { page } = customID.data;

        const locations = await GuildLocation.findAll({
            where: { userID: interaction.user.id },
            attributes: ['guildID'],
            limit: 25,
            offset: page * 25,
        });

        if (!locations.length) {
            throw new NotFoundError('No more servers.');
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
                    guilds.map((guild) =>
                        new StringSelectMenuOptionBuilder().setLabel(guild.name).setValue(guild.id)
                    )
                )
        );

        const pageButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'remove-location-page',
                        data: { page: page - 1 },
                    })
                )
                .setDisabled(page <= 0),
            new ButtonBuilder()
                .setLabel('⏩')
                .setDisabled(guilds.length < 25)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'remove-location-page',
                        data: { page: page + 1 },
                    })
                )
        );

        interaction.update({
            components: [guildsMenu, pageButtons],
        });
    },
};
