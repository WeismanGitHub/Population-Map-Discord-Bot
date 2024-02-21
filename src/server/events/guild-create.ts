import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Guild, PermissionFlagsBits } from 'discord.js';
import { InfoEmbed } from '../utils/embeds';
import config from '../config';

export default {
    name: Events.GuildCreate,
    once: false,
    check: async (guild: Guild) => guild,
    execute: async (guild: Guild) => {
        const channel = guild.systemChannel;

        if (!channel) return;
        if (!guild?.members.me?.permissions.has(PermissionFlagsBits.SendMessages)) return;

        const embed = new InfoEmbed(
            null,
            'The Population Map Bot is a dynamic map generator capable of visualizing population data on a global, continental, or country level. Maps are generated from self-reported locations provided by Discord server members, enabling users to explore population distributions with ease.\n\nThis bot generates a unique map for each Discord server that can be accessed with `/map`. Server members use `/set-location` to add their location to the map. A location can be any country and, optionally, a subdivision (state, region, prefecture, etc.) within that country. Server admins can also make it so only members who share their location can access the server.'
        )
            .addFields({ name: 'Contact the Creator:', value: `<@${config.mainAccountID}>` })
            .setImage(
                'https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg'
            );

        const linksRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder().setLabel('Website').setURL(config.websiteURL).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel('GitHub').setURL(config.githubURL).setStyle(ButtonStyle.Link),
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

        await channel.send({
            embeds: [embed],
            components: [firstRow, linksRow],
        });
    },
};
