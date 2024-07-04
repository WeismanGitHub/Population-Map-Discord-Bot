import { InfoEmbed } from '../../utils/embeds';
import iso31662 from '../../utils/iso31662';
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
        const lettersRow1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        // customId needs to be unique so I added x: 0
                        data: { commandType: 'map-country', x: 0 },
                    })
                )
                .setPlaceholder('A - L')
                .addOptions(
                    iso31662.countryLetters
                        .slice(0, 13)
                        .map((letter) =>
                            new StringSelectMenuOptionBuilder().setLabel(letter).setValue(letter)
                        )
                )
        );

        const lettersRow2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(
                    JSON.stringify({
                        type: 'country-letter',
                        // customId needs to be unique so I added x: 1
                        data: { commandType: 'map-country', x: 1 },
                    })
                )
                .setPlaceholder('M - Z')
                .addOptions(
                    iso31662.countryLetters
                        .slice(13)
                        .map((letter) =>
                            new StringSelectMenuOptionBuilder().setLabel(letter).setValue(letter)
                        )
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

        await interaction.reply({
            ephemeral: true,
            embeds: [new InfoEmbed("Which letter does the country's name begin with?")],
            components: [lettersRow1, lettersRow2, mapButtonsRow],
        });
    },
};
