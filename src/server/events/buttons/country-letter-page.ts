import alphabet from '../../utils/letters';
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

        if (customID.type !== 'country-letter-page') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{ page: number; commandType: string }>;
    }) => {
        const { page, commandType } = customID.data;

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        data: { commandType },
                    })
                )
                .setPlaceholder('Select a letter!')
                .addOptions(
                    alphabet
                        .slice(page * 13, page * 13 + 13)
                        .map((letter) =>
                            new StringSelectMenuOptionBuilder().setLabel(letter).setValue(letter)
                        )
                )
        );

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('A-M')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter-page',
                        data: { page: 0, commandType },
                    })
                ),
            new ButtonBuilder()
                .setLabel('N-Z')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter-page',
                        data: { page: 1, commandType },
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

        interaction.update({
            components: mapButtonsRow ? [menuRow, buttonsRow, mapButtonsRow] : [menuRow, buttonsRow],
        });
    },
};
