import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription("Generate a population density world map based off of server member's locations.")
        .setDMPermission(false)
	,
	async execute(interaction: CommandInteraction): Promise<void> {
	}
}
