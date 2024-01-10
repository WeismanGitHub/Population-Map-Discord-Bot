import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { GuildLocation } from '../../db/models'
import { infoEmbed } from '../../utils/embeds'
import { NotFoundError } from '../../errors'

export default {
	data: new SlashCommandBuilder()
		.setName('view-location')
        .setDMPermission(false)
		.setDescription("View the location you set in a server.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
		const location = await GuildLocation.findOne({ where: {
				userID: interaction.user.id, guildID: interaction.guildId!
			}
		})

		if (!location) {
			throw new NotFoundError("Could not find your location in the database.")
		}

		interaction.reply({
			ephemeral: true,
			embeds: [infoEmbed(
				'Your location in this server:',
				`
				\`Country\`: \`${location.countryCode}\`
                \`Subdivision\`: ${location.subdivisionCode}\`
				`
			)]
		})
	}
}