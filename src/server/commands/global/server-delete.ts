import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { ForbiddenError, NotFoundError } from '../../errors'
import { infoEmbed } from '../../utils/embeds'
import { Guild } from '../../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('server-delete')
        .setDMPermission(false)
		.setDescription("Delete the data of a server.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== interaction.guild?.ownerId) {
            throw new ForbiddenError("Only the server owner can use this command.");
        }

		const deletedRows = await Guild.destroy({ where: { guildID: interaction.guildId! } })

		if (deletedRows === 0) {
			throw new NotFoundError('Could not find this server in the database.')
		}

        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('The server data has been deleted.')]
        })
	}
}