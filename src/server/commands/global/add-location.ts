import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { Guild, User } from '../../db/models'
import { NotFoundError } from '../../errors'

export default {
	data: new SlashCommandBuilder()
		.setName('add-location')
        .setDMPermission(false)
		.setDescription("Use this command in a server to add your location to the server map.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
		const guildID = interaction.guildId!
		const guild = await Guild.findOne({ where: { ID: guildID! } })

        if (!guild) {
            throw new NotFoundError('This server is not in the database.')
        }
		
		// @ts-ignore
		const [affectedRows] = await User.update({ guildIDs: guildID }, { where: { discordID: interaction.user.id } })

		if (!affectedRows) {
			throw new NotFoundError('Could not find you in database.')
		}
	}
}