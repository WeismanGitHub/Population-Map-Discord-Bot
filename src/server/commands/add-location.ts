import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { InternalServerError, NotFoundError } from '../errors'
import { User, GuildMap } from '../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('add-location')
        .setDMPermission(false)
		.setDescription("Use this command in a server to add your location to the server map.")
	,
	async execute(interaction: ChatInputCommandInteraction) {
        if (!guild) {
            throw new NotFoundError('No server map could be found.')
        }
	}
}