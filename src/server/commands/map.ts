import {
	SlashCommandBuilder,
	CommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('map')
        .setDMPermission(false)
		.setDescription("Get a server map for a specific country.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
	}
}
