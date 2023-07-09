import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { Guild, User } from '../../db/models'
import { NotFoundError } from '../../errors'
import { infoEmbed } from '../../utils/embeds'

export default {
	data: new SlashCommandBuilder()
		.setName('remove-location')
        .setDMPermission(false)
		.setDescription("Use this command in a server to remove your location to the server map.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
		const guildID = interaction.guildId!
		const guild = await Guild.findOne({ where: { ID: guildID! } })

        if (!guild) {
            throw new NotFoundError('This server is not in the database.')
        }
		
		const user = await User.findOne({ where: { discordID: interaction.user.id } })

		if (!user) {
			throw new NotFoundError('Could not find you in the database.')
		}

		await user.removeLocationFromGuild(guildID)

		interaction.reply({
			ephemeral: true,
			embeds: [infoEmbed('Your location has been removed!')]
		})
	}
}