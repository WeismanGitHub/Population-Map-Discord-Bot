import iso31662 from '../../utils/countries';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    Interaction,
    LinkButtonComponentData,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID = JSON.parse(interaction.customId);

        if (customID.type !== 'country-letter') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{ commandType: string }>;
    }) => {
        const letter = interaction.values[0] as CountryLetter;
        const countries = iso31662.countries[letter];
        const { commandType } = customID.data;

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: commandType,
                        data: { commandType },
                    })
                )
                .setPlaceholder('Select a country!')
                .addOptions(
                    countries
                        .slice(0, 25)
                        .map((country) =>
                            new StringSelectMenuOptionBuilder().setLabel(country.name).setValue(country.code)
                        )
                )
        );

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(countries.length <= 25)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-page',
                        data: { page: 1, commandType, letter },
                    })
                )
        );

        const mapButtonsRow = !interaction.message.components[2]
            ? null
            : new ActionRowBuilder<ButtonBuilder>().addComponents(
                  interaction.message.components[2].components.slice(0, 4).map(({ data }) => {
                      const { label, url, style } = data as LinkButtonComponentData;

                      return new ButtonBuilder()
                          .setLabel(label || 'error')
                          .setStyle(style)
                          .setURL(url);
                  })
              );

        await interaction.update({
            components: mapButtonsRow ? [menuRow, buttonsRow, mapButtonsRow] : [menuRow, buttonsRow],
        });
    },
};
