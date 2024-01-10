import { InternalServerError } from '../../errors';
import { GuildLocation, User } from '../../db/models';
import { infoEmbed } from '../../utils/embeds';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    Interaction,
    StringSelectMenuInteraction,
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
        const countryCode = interaction.values[0];

        await User.upsert({ userID: interaction.user.id }).catch((err) => {
            throw new InternalServerError('Could not write to database.');
        });

        await GuildLocation.upsert({
            guildID: interaction.guildId!,
            userID: interaction.user.id,
            countryCode,
            subdivisionCode: null,
        }).catch((err) => {
            throw new InternalServerError('Could not save your country.');
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('subdivisions')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'location-subdivision',
                        data: { countryCode },
                    })
                )
        );

        await interaction.update({
            embeds: [
                infoEmbed(
                    'Selected a country!',
                    'You can also optionally choose your subdivision (state, region, prefecture, etc).'
                ),
            ],
            components: [row],
        });
    },
};
