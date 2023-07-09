import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { Guild, GuildCountries, GuildCountry, User } from '../../db/models'
import { BadRequestError, InternalServerError, NotFoundError } from '../../errors'
import sequelize from '../../db/sequelize'
import { infoEmbed } from '../../utils/embeds'

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

		if (!user || !user.guildIDs) {
			throw new NotFoundError('Could not find you in the database.')
		}

		if (user.guildIDs.includes(guildID)) {
			throw new BadRequestError('You have already added your location to this server.')
		}

		const guildCountries = new GuildCountries(guildID)
		
		await sequelize.transaction(async (transaction) => {
			await guildCountries.increaseCountry(user.countryCode, transaction)
			// @ts-ignore
			await user.update({ guildIDs: [...user.guildIDs, guildID] }, { transaction })
	
			if (user.subdivisionCode) {
				const guildCountry = new GuildCountry(guildID, user.countryCode)
				await guildCountry.sync()
				
				await guildCountry.increaseSubdivision(user.subdivisionCode, transaction)
			}
		}).catch(err => {
			console.log(err)
			throw new InternalServerError('Could not save location to database.')
		})

		interaction.reply({
			ephemeral: true,
			embeds: [infoEmbed('Your location has been added!', 'View the server map with `/map`.')]
		})
	}
}