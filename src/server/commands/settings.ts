import {
    SlashCommandBuilder,
    CommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription("Choose your settings.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
	}
}
