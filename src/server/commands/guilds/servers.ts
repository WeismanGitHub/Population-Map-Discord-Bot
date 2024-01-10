import { guildEmbed } from '../../utils/embeds'
import { ForbiddenError } from '../../errors'
import { User } from '../../db/models'
import config from '../../config'
import {
	SlashCommandBuilder,
	CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('servers')
		.setDescription("[Privileged Users Only] See the servers this bot is in.")
		.setDMPermission(false)
	,
	guildIDs: [config.supportServerID, ...config.personalServerIDs],
	async execute(interaction: CommandInteraction) {
		const user = await User.findOne({ where: { userID: interaction.user.id } })

		if (!user) {
			throw new ForbiddenError('You are not in the database.')
		}

		if (user.role !== 'admin') {
			throw new ForbiddenError('You are not an admin.')
		}

        const guildEmbeds = interaction.client.guilds.cache.first(10).map((guild) => guildEmbed(guild))

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setDisabled(guildEmbeds.length < 10)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'servers-page',
                    data: { page: 1 }
                }))
        )

        interaction.reply({
            ephemeral: true,
            embeds: guildEmbeds,
            components: [buttonsRow]
        })
	}
}
