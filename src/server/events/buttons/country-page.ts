import iso31662 from '../../utils/countries';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Events,
    Interaction,
    LinkButtonComponentData,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const customID = JSON.parse(interaction.customId);

        if (customID.type !== 'country-page') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{ page: number; commandType: string; letter: CountryLetter }>;
    }) => {
        const { page, commandType, letter } = customID.data;
        const countries = iso31662.countries[letter];

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: commandType,
                        data: {},
                    })
                )
                .setPlaceholder('Select a country!')
                .addOptions(
                    countries
                        .slice(page * 25, page * 25 + 25)
                        .map((country) =>
                            new StringSelectMenuOptionBuilder().setLabel(country.name).setValue(country.code)
                        )
                )
        );

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page <= 0)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-page',
                        data: { page: page - 1, commandType, letter },
                    })
                ),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled((page + 1) * 25 >= countries.length)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-page',
                        data: { page: page + 1, commandType, letter },
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
