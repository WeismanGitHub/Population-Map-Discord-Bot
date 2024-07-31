import { InfoEmbed } from '../../utils/embeds';
import config from '../../config';
import {
    SlashCommandBuilder,
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('help').setDescription('Information about this bot.'),
    guildIDs: null,
    async execute(interaction: CommandInteraction): Promise<void> {
        const embed = new InfoEmbed(
            null,
            "The Population Map Bot is a dynamic map generator that visualizes your Discord server's population data on a global, continental, or country level. Maps are generated from self-reported locations provided by server members and are anonymous.\n\nServer members use `/set-location` to set their country and, optionally, a subdivision (state, province, etc.) within that country. Maps are generated through the website, and you can get a link to a server's map with `/map`. Server admins can also make it so only members who share their location can access the server."
        )
            .addFields({ name: 'Contact the Creator:', value: `<@${config.mainAccountID}>` })
            .setImage(
                'https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg'
            );

        const linksRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder().setLabel('Website').setURL(config.websiteURL).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('Server').setURL(config.serverInvite).setStyle(ButtonStyle.Link),
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

        await interaction.reply({
            embeds: [embed],
            components: interaction.guild ? [firstRow, linksRow, mapButtonsRow] : [firstRow, linksRow],
            ephemeral: true,
        });
    },
};
