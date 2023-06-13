import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { infoEmbed } from '../utils/embeds'
import { User } from '../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('user-settings')
		.setDescription("View your location.")
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const user = await User.findOne({ where: { discordID: interaction.user.id } })

        if (!user) {
            return interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed('You need to first set your location with `/location`.', 'Please read the documentation with `/help`.')]
            })
        }
        
        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Your location:', `Country: ${user?.countryCode}\nSubdivision: ${user.subdivisionCode}`)]
        })
	}
}