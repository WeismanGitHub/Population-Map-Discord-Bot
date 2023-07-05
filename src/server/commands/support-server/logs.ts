import { ForbiddenError } from '../../errors'
import { User } from '../../db/models'
import {
	SlashCommandBuilder,
	CommandInteraction,
} from 'discord.js'
import config from '../../config'

export default {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription("[Privileged Users Only] See the logs.")
		.setDMPermission(false)
	,
	guildIDs: [config.supportServerID],
	async execute(interaction: CommandInteraction): Promise<void> {
		const user = await User.findOne({ where: { discordID: interaction.user.id } })

		if (!user) {
			throw new ForbiddenError('You are not in the database.')
		}

		if (user.role !== 'admin') {
			throw new ForbiddenError('You are not an admin.')
		}
	}
}
