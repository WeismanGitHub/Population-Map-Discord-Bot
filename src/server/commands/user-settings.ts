import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { InternalServerError } from '../errors'
import { CustomClient } from '../custom-client'
import { infoEmbed } from '../utils/embeds'
import { User } from '../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('user-settings')
		.setDescription("View your location and change your settings.")
        .addBooleanOption(option => option
            .setName('add-location-on-join')
            .setDescription("Automatically add your location to a server's map when you join. Off by default.")
        )
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const user = await User.findOne({ where: { discordID: interaction.user.id } })
        const client = interaction.client as CustomClient
        const addLocationOnJoin = interaction.options.getBoolean('add-location-on-join')

        if (!user) {
            return interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed('You need to first set your location with `/location`.', 'Please read the documentation with `/help`.')]
            })
        }

        if (addLocationOnJoin !== null) {
            user.update({ addLocationOnJoin})
            .catch(err => { throw new InternalServerError('Could not save `add-location-on-join` setting.') })
        }
        
        const country = client.getCountry(user.countryCode)

        if (!country) {
            throw new InternalServerError('Could not find country.')
        }

        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Your Data:',`
            Country: ${country.name}
            ${user.subdivisionCode ? `Subdivision: ${country.sub.find(sub => sub.code === user.subdivisionCode)?.name}` : ''}\n
            \`add-location-on-join\`: \`${user.addLocationOnJoin}\`
            `)]
        })
	}
}