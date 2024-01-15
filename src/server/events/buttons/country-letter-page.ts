import { alphabet } from '../../utils/letters';
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

        const customID: CustomID<{ page: number; }> = JSON.parse(
            interaction.customId
        );

        if (customID.type !== 'country-letter-page') return;

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

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        data: {},
                    })
                )
                .setPlaceholder('Select a country!')
                .addOptions(
                    alphabet.slice(page * 13, (page * 13) + 13)
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
                        data: { page: 0 },
                    }
                )),
            new ButtonBuilder()
                .setLabel('N-Z')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter-page',
                        data: { page: 1 },
                    })
                )
        );

        interaction.update({
            components: [menuRow, buttonsRow],
        });
    },
};
