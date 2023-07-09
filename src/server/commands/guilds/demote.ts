import { infoEmbed } from '../../utils/embeds'
import { ForbiddenError } from '../../errors'
import { User } from '../../db/models'
import config from '../../config'
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('demote')
		.setDescription("[Bot Owner Only] Demote a user.")
		.setDMPermission(false)
        .addStringOption(option => option
            .setName('user-id')
            .setDescription("The user ID of whoever you want to demote.")
            .setRequired(true)
        )
	,
	guildIDs: [config.supportServerID, ...config.personalServerIDs],
	async execute(interaction: ChatInputCommandInteraction) {
        await interaction.client.application.fetch()

        if (interaction.user.id !== interaction.client.application.owner?.id) {
            throw new ForbiddenError('You are not the bot owner.')
        }

		const user = await User.findOne({ where: { discordID: interaction.options.getString('user-id')! } })

		if (!user) {
			throw new ForbiddenError('User is not in the database.')
		}

		if (user.role === 'regular') {
			throw new ForbiddenError('They are already a regular user.')
		}

        await user.update({ role: 'regular' })

        interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Demoted the user.')]
        })
	}
}
