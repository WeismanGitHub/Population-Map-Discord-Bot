import { CustomClient } from '../custom-client'
import {
	SlashCommandBuilder,
	CommandInteraction,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('map')
        .setDMPermission(false)
		.setDescription("Get a server map for a specific country.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
		const client = interaction.client as CustomClient

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'map-country',
                    data: {}
                }))
                .setPlaceholder('Select a country!')
                .addOptions(
                    client.countries.slice(0, 25).map(country => 
                        new StringSelectMenuOptionBuilder()
                            .setLabel(country.name)
                            .setValue(country.code)
                    )
                )
        )

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'map-country-page',
                    data: { page: 1, countrySelectType: 'map-country' }
                }))
        )

        interaction.reply({
            ephemeral: true,
            components: [menuRow, buttonsRow]
        })
	}
}
