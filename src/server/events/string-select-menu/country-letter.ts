import { CustomClient } from '../../custom-client';
import { letterPageMap } from '../../utils/letters';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId);

        if (customID.type !== 'location-country') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{}>;
    }) => {
        const client = interaction.client as CustomClient;
        const letter = interaction.values[0];
        const countryPage = letterPageMap[letter]

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'location-country',
                        data: {},
                    })
                )
                .setPlaceholder('Select a country!')
                .addOptions(
                    client.countries
                        .slice(countryPage * 25, (countryPage * 25) + 25)
                        .map((country) =>
                            new StringSelectMenuOptionBuilder().setLabel(country.name).setValue(country.code)
                        )
                )
        );

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-page',
                        data: { page: countryPage, countrySelectType: 'location-country' },
                    })
                )
                .setDisabled(countryPage * 25 === 0),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(client.countries.length - (countryPage * 25) <= 25)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-page',
                        data: { page: countryPage, countrySelectType: 'location-country' },
                    })
                )
        );

        interaction.reply({
            ephemeral: true,
            components: [menuRow, buttonsRow],
        });
    },
};
