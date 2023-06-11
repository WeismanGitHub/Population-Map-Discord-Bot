import config from '../config'
import {
	SlashCommandBuilder,
	CommandInteraction,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Information about this bot.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
		const embed: EmbedBuilder = new EmbedBuilder()
		.setColor('#FF7B00') // orange
		.setDescription("Generate a population density map based off of server member's self reported locations.")
		.addFields({ name: 'Contact the Creator:', value: `<@${config.mainAccountID}>` })
		// .setImage('../../../population-map-example.png')
	
		const linksRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Github')
			.setURL(config.githubURL)
			.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
			.setLabel('Buy Me a Coffee')
			.setURL(config.buyMeACoffeeURL)
			.setStyle(ButtonStyle.Link),
		])

		const docsRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('User Docs')
			.setCustomId('help-users')
			.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
			.setLabel('Server Owner Docs')
			.setCustomId('help-owners')
			.setStyle(ButtonStyle.Primary),
		])

		interaction.reply({
			embeds: [embed],
			components: [docsRow, linksRow],
			ephemeral: true
		})
	}
}
