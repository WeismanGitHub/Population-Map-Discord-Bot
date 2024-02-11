import { country } from 'iso-3166-2';
import config from '../../config';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    StringSelectMenuInteraction,
    LinkButtonComponentData,
    Interaction,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId);

        if (customID.type !== 'map-country') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{}>;
    }) => {
        const previousMapButtons = interaction.message.components[2].components
            .slice(0, 4)
            .map(({ data }) => {
                const { label, url, style } = data as LinkButtonComponentData;

                return new ButtonBuilder()
                    .setLabel(label || 'error')
                    .setStyle(style)
                    .setURL(url);
            });

        const mapButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            ...previousMapButtons,
            new ButtonBuilder()
                .setLabel(`${country(interaction.values[0])?.name} Map`)
                .setStyle(ButtonStyle.Link)
                .setURL(`${config.websiteURL}/maps/${interaction.guildId}?mapCode=${interaction.values[0]}`)
        );

        await interaction.update({
            components: [interaction.message.components[0], interaction.message.components[1], mapButtons],
        });
    },
};
