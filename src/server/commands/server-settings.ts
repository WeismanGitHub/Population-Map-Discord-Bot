import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { infoEmbed } from '../utils/embeds'
import { Guild } from '../db/models'

export default {
	data: new SlashCommandBuilder()
		.setName('server-settings')
		.setDescription("Change your server's settings. Choosing no options just sends the settings.")
        .setDMPermission(false)
        .addRoleOption(option => option
            .setName('admin-role')
            .setDescription("Server members with the admin role can change server settings.")
        )
        .addRoleOption(option => option
            .setName('map-role')
            .setDescription("Server members with the map role can view the server map if visibility is set to map-role.")
        )
        .addStringOption(option => option
            .setName('remove-role')
            .setDescription("Remove the admin or map role. Does not delete the role from your server.")
            .addChoices(
                { name: 'admin-role', value: 'admin-role' },
                { name: 'map-role', value: 'map-role' },
            )
        )
        .addStringOption(option => option
            .setName('visibility')
            .setDescription("Change who can view the server map.")
            .addChoices(
                { name: 'public', value: 'public' },
                { name: 'member-restricted', value: 'member-restricted' },
                { name: 'map-role-restricted', value: 'map-role-restricted' },
                { name: 'admin-role-restricted', value: 'admin-role-restricted' },
                { name: 'invisibile', value: 'invisibile' },
            )
        )
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        const guild = await Guild.findOne({ where: { ID: interaction.guildId } })
        
        if (!guild && interaction.user.id !== interaction.guild?.ownerId) {
            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed("The server owner still needs to use `/server-settings`.")]
            })
        } else if (interaction.user.id === interaction.guild?.ownerId) {
            Guild.create({
                ID: interaction.guildId,
            })
        }
	}
}