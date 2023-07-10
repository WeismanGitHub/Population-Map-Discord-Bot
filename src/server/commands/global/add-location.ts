import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { infoEmbed } from '../../utils/embeds'
import { Guild, User } from '../../db/models'
import { NotFoundError } from '../../errors'

export default {
	data: new SlashCommandBuilder()
		.setName('add-location')
        .setDMPermission(false)
		.setDescription("Use this command in a server to add your location to the server map.")
	,
	guildIDs: null,
	async execute(interaction: ChatInputCommandInteraction) {
		const guildID = interaction.guildId!
		const guild = await Guild.findOne({ where: { ID: guildID! } })

        if (!guild) {
            throw new NotFoundError('This server is not in the database.')
        }
		
		const user = await User.findOne({ where: { discordID: interaction.user.id } })

		if (!user) {
			throw new NotFoundError('Could not find you in the database.')
		}

		await user.addLocationToGuild(guildID)

		interaction.reply({
			ephemeral: true,
			embeds: [infoEmbed(
				null,
				`# Your location has been added!
				## Server Settings
				\`visibility\`: \`${guild.visibility}\`
                \`admin-role\`: ${guild.adminRoleID ? `<@&${guild.adminRoleID}>` : '`null`'}
                \`map-role\`: ${guild.mapRoleID ? `<@&${guild.mapRoleID}>` : '`null`'}`
			)]
		})
	}
}