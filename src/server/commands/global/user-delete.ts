import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { infoEmbed } from '../../utils/embeds'
import { User } from '../../db/models'
import { NotFoundError } from '../../errors'

export default {
	data: new SlashCommandBuilder()
		.setName('user-delete')
		.setDescription("Delete all your user data.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
		const user = await User.findOne({ where: { discordID: interaction.user.id } })

		if (!user) {
			throw new NotFoundError('Could not find your user data in database.')
		}

		await user.deleteLocation()

        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Your data has been deleted.')]
        })
	}
}