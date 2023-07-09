import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('add-location')
        .setDMPermission(false)
		.setDescription("Use this command in a server to remove your location to the server map.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
	}
}