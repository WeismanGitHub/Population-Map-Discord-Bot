import iso31662 from '../../utils/countries';
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

        const customID: CustomID<{ page: number; countryCode: string }> = JSON.parse(interaction.customId);
        const { type } = customID;

        if (type !== 'location-subdivision-page') {
            return;
        }

        return { customID: customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{ page: number; countryCode: string }>;
    }) => {
        const { countryCode, page } = customID.data;
        const country = iso31662.getCountry(countryCode);

        const subdivisions = country.sub.slice(page * 25, page * 25 + 25);

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'location-subdivision',
                        data: { countryCode },
                    })
                )
                .setPlaceholder('Select your subdivision!')
                .addOptions(
                    subdivisions.map((subdivision) =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(subdivision.name)
                            .setValue(subdivision.code)
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
                        type: 'location-subdivision-page',
                        data: { page: page - 1, countryCode },
                    })
                ),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(subdivisions.length < 25)
                .setCustomId(
                    JSON.stringify({
                        type: 'location-subdivision-page',
                        data: { page: page + 1, countryCode },
                    })
                )
        );

        interaction.update({ components: [menuRow, buttonsRow] });
    },
};
