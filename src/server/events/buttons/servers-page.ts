import { GuildEmbed } from '../../utils/embeds';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Collection,
    Events,
    Interaction,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const customID: CustomID<{ page: number }> = JSON.parse(interaction.customId);

        if (customID.type !== 'servers-page') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{ page: number }>;
    }) => {
        const { page } = customID.data;

        const guilds = new Collection(
            Array.from(interaction.client.guilds.cache).slice(page * 10, 10 + page * 10)
        );

        const guildEmbeds = guilds.map((guild) => new GuildEmbed(guild));
        const noNextPage = interaction.client.guilds.cache.size - (page + 1) * 10 == 0;

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setDisabled(page <= 0)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'servers-page',
                        data: { page: page - 1 },
                    })
                ),
            new ButtonBuilder()
                .setLabel('⏩')
                .setDisabled(guildEmbeds.length < 10 || noNextPage)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'servers-page',
                        data: { page: page + 1 },
                    })
                )
        );

        await interaction.update({
            embeds: guildEmbeds,
            components: [buttonsRow],
        });
    },
};
