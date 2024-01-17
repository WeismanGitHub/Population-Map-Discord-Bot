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
import { errorEmbed } from '../../utils/embeds';

export default {
    data: new SlashCommandBuilder()
        .setName('remove-location')
        .setDescription('Remove your location from a server map.'),
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

        const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
            input.status === 'fulfilled';

        const guilds = (
            await Promise.allSettled(
                locations.map((location) => {
                    return interaction.client.guilds.fetch(location.guildID);
                })
            )
        ).filter(isFulfilled);

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
                        new StringSelectMenuOptionBuilder()
                            .setLabel(guild.value.name)
                            .setValue(guild.value.id)
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
                .setDisabled(locations.length < 25)
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
            embeds: !guilds.length ? [errorEmbed('Could not fetch server(s).')] : [],
            components: !guilds.length ? [pageButtons] : [guildsMenu, pageButtons],
        });
    },
};
