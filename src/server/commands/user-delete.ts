import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
// import { InternalServerError } from '../errors'
import { infoEmbed } from '../utils/embeds'
// import { User } from '../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('user-delete')
		.setDescription("Delete all your user data.")
	,
	globalCommand: true,
	async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Your data has been deleted.')]
        })
	}
}