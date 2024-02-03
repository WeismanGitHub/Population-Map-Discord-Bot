import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { InternalServerError, NotFoundError } from '../../errors';
import { GuildLocation } from '../../db/models';
import { InfoEmbed } from '../../utils/embeds';
import iso31662 from '../../utils/countries';

export default {
    data: new SlashCommandBuilder()
        .setName('view-location')
        .setDMPermission(false)
        .setDescription('View the location you set in a server.'),
    guildIDs: null,
    async execute(interaction: ChatInputCommandInteraction) {
        const location = await GuildLocation.findOne({
            where: {
                userID: interaction.user.id,
                guildID: interaction.guildId!,
            },
        });

        if (!location) {
            throw new NotFoundError('Could not find your location in the database.');
        }

        const country = iso31662.getCountry(location.countryCode);
        const subdivision = country?.sub.find((sub) => {
            return sub.code == location.subdivisionCode;
        });

        if (!country) {
            throw new InternalServerError('Could not get country.');
        }

        await interaction.reply({
            ephemeral: true,
            embeds: [
                new InfoEmbed(
                    'Your location in this server:',
                    `
				\`Country\`: \`${country.name}\`
                \`Subdivision\`: \`${subdivision?.name || null}\`
				`
                ),
            ],
        });
    },
};
