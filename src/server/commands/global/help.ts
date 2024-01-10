import { infoEmbed } from '../../utils/embeds';
import config from '../../config';
import { resolve } from 'path';
import {
    SlashCommandBuilder,
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('help').setDescription('Information about this bot.'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        const attachment = new AttachmentBuilder(resolve(__dirname, '../../../../images/WORLD-example.jpg'), {
            name: 'world-example.png',
        });

        const embed = infoEmbed(
            null,
            "The Population Map Bot is a dynamic map generator capable of visualizing population data on a global, continental, or country level. Maps are generated from self-reported locations provided by Discord server members, enabling users to explore population distributions with ease. The application facilitates efficient data processing and visualization, empowering users to gain valuable insights into population patterns across the world. `/map` can be used to get a map for a specific country. Countries and subdivisions are from [ISO 3166](https://www.iso.org/iso-3166-country-codes.html)."
        )
            .addFields({ name: 'Contact the Creator:', value: `<@${config.mainAccountID}>` })
            .setImage('attachment://world-example.png');

        const linksRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder().setLabel('Website').setURL(config.websiteURL).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('Github').setURL(config.githubURL).setStyle(ButtonStyle.Link),
            // 	new ButtonBuilder()
            // 	.setLabel('Buy Me a Coffee')
            // 	.setURL(config.buyMeACoffeeURL)
            // 	.setStyle(ButtonStyle.Link),
        ]);

        const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('User Docs')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'help-users',
                        data: {},
                    })
                ),
            new ButtonBuilder()
                .setLabel('Server Owner Docs')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'help-owners',
                        data: {},
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
            embeds: [embed],
            components: interaction.guild ? [firstRow, linksRow, mapButtonsRow] : [firstRow, linksRow],
            ephemeral: true,
            files: [attachment],
        });
    },
};
