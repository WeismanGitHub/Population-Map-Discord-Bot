import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { InternalServerError } from '../errors'
import { CustomClient } from '../custom-client'
import { infoEmbed } from '../utils/embeds'
import { User } from '../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('user-settings')
		.setDescription("View your location.")
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const user = await User.findOne({ where: { discordID: interaction.user.id } })
        const client = interaction.client as CustomClient

        if (!user) {
            return interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed('You need to first set your location with `/location`.', 'Please read the documentation with `/help`.')]
            })
        }
        
        const country = client.countries.find((country) => country.code === user.countryCode)

        if (!country) {
            throw new InternalServerError('Could not find country.')
        }

        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Your location:',
            `Country: ${country.name}\n
            ${user.subdivisionCode ? `Subdivision: ${country.sub.find(sub => sub.code === user.subdivisionCode)?.name}` : ''}`
            )]
        })
	}
}