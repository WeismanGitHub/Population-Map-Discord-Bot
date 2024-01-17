import { NotFoundError } from '../../errors';
import alphabet from '../../utils/letters';
import { Guild } from '../../db/models';
import {
    SlashCommandBuilder,
    CommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('set-location')
        .setDMPermission(false)
        .setDescription('Set your country and optionally your subdivision (state, region, prefecture, etc).'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        const guild = await Guild.findOne({ where: { guildID: interaction.guildId! } });

        if (!guild) {
            throw new NotFoundError("This server hasn't been set up.");
        }

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        data: { commandType: 'location-country' },
                    })
                )
                .setPlaceholder('What letter does your country start with?')
                .addOptions(
                    alphabet
                        .slice(0, 13)
                        .map((letter) =>
                            new StringSelectMenuOptionBuilder().setLabel(letter).setValue(letter)
                        )
                )
        );

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('A-M')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('N-Z')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter-page',
                        data: { page: 1, commandType: 'location-country' },
                    })
                )
        );

        interaction.reply({
            ephemeral: true,
            components: [menuRow, buttonsRow],
        });
    },
};
