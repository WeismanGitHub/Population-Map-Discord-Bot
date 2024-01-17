import alphabet from '../../utils/letters';
import config from '../../config';
import {
    SlashCommandBuilder,
    CommandInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDMPermission(false)
        .setDescription('Get the server map for the world, continents, or a specific country.'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        data: { commandType: 'map-country' },
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
                        data: { page: 1, commandType: 'map-country' },
                    })
                )
        );

        const mapButtonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('World Map')
                .setStyle(ButtonStyle.Link)
                .setURL(`${config.websiteURL}/maps/${interaction.guildId}?mapCode=WORLD`),
            new ButtonBuilder()
                .setLabel('Continents Map')
                .setStyle(ButtonStyle.Link)
                .setURL(`${config.websiteURL}/maps/${interaction.guildId}?mapCode=CONTINENTS`)
        );

        interaction.reply({
            ephemeral: true,
            components: [menuRow, buttonsRow, mapButtonsRow],
        });
    },
};
