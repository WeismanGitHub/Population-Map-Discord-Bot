import { BadRequestError, NotFoundError } from '../../errors'
import { Guild, User } from '../../db/models'
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ButtonBuilder,
	ButtonStyle
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('remove-location')
		.setDescription("Use this command in a server to remove your location from a server map.")
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

		if (!user.guildIDs?.length) {
			throw new BadRequestError('You have not saved your location in any servers.')
		}

		const guilds = await Promise.all(user.guildIDs.map(guildID => {
			return interaction.client.guilds.fetch(guildID)
		}))

		const guildsRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'remove-location',
                    data: {}
                }))
                .setPlaceholder('Select a server!')
                .addOptions(guilds.slice(0, 25).map(guild =>
					new StringSelectMenuOptionBuilder().setLabel(guild.name).setValue(guild.id)
				))
        )

		const pageButtonsRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
				.setDisabled(guilds.length < 25)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'remove-location-page',
                    data: { page: 1 }
                }))
        )

		interaction.reply({
			ephemeral: true,
			components: [guildsRow, pageButtonsRow],
		})
	}
}