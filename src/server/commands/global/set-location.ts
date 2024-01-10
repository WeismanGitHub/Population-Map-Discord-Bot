import { CustomClient } from '../../custom-client'
import { NotFoundError } from '../../errors'
import { Guild } from '../../db/models'
import {
    SlashCommandBuilder,
    CommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('set-location')
        .setDMPermission(false)
		.setDescription("Set your country and optionally your subdivision (state, region, prefecture, etc)."),
    guildIDs: null,
	async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as CustomClient
        const guild = await Guild.findOne({ where: { guildID: interaction.guildId! } })

        if (!guild) {
            throw new NotFoundError("This server hasn't been set up.")
        }

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'location-country',
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
                    type: 'country-page',
                    data: { page: 1, countrySelectType: 'location-country' }
                }))
        )

        interaction.reply({
            ephemeral: true,
            components: [menuRow, buttonsRow]
        })
	}
}
