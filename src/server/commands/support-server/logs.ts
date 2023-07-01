import {
	SlashCommandBuilder,
	CommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription("[Privileged Users Only] See the logs.")
		.setDMPermission(false)
	,
	globalCommand: false,
	async execute(interaction: CommandInteraction): Promise<void> {
	}
}
