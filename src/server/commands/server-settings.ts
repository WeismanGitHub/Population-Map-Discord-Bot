import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMemberManager } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors'
import { infoEmbed } from '../utils/embeds'
import { Guild } from '../db/models'

interface GuildSettings {
    visibility?: 'public' | 'member-restricted' | 'map-role-restricted' | 'admin-role-restricted' | 'invisibile'
    mapRoleID?: string | null
    adminRoleID?: string | null
}

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
                { name: 'admin-role', value: 'adminRoleID' },
                { name: 'map-role', value: 'mapRoleID' },
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
	async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) return 

        const visibilityChoice = interaction.options.getString('visibility') as GuildSettings['visibility'] | null
        const removeRoleChoice = interaction.options.getString('remove-role')
        const adminRoleChoice = interaction.options.getRole('admin-role')
        const mapRoleChoice = interaction.options.getRole('map-role')
        const settings: GuildSettings = {}

        if (visibilityChoice) {
            settings.visibility = visibilityChoice
        }

        if (adminRoleChoice) {
            settings.adminRoleID = adminRoleChoice.id
        }

        if (mapRoleChoice) {
            settings.mapRoleID = mapRoleChoice.id
        }

        if (removeRoleChoice) {
            settings[removeRoleChoice as 'adminRoleID' | 'mapRoleID'] = null
        }

        if (interaction.user.id === interaction.guild?.ownerId && Object.keys(settings).length) {
            const guild = (await Guild.upsert({
                ID: interaction.guildId,
                ...settings
            }).catch(err => { throw new InternalServerError('Could not save server settings.') }))[0]

            return interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed('Server Settings',
                    `\`visibility\`: \`${guild.visibility}\`\n
                    \`admin-role\`: ${guild.adminRoleID ? `<@&${guild.adminRoleID}>` : null}\n
                    \`map-role\`: ${guild.mapRoleID ? `<@&${guild.mapRoleID}>` : null}`
                )]
            })
        }

        let guild = await Guild.findOne({ where: { ID: interaction.guildId } })

        if (!guild) {
            return interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed("The server owner still needs to set up with `/server-settings`.")]
            })
        }

        const roles = (interaction.member.roles as unknown as GuildMemberManager).cache
        const userIsAdmin = guild.adminRoleID ? roles.has(guild.adminRoleID) : false

        if (!userIsAdmin && Object.keys(settings).length) {
            throw new BadRequestError('Only admins and the owner can change server settings.')
        }

        if (userIsAdmin && Object.keys(settings).length) {
            if (settings.adminRoleID) {
                throw new BadRequestError('Admins cannot edit the admin role.')
            }

            guild.update(settings).catch(err => {
                throw new InternalServerError('Could not save server settings.')
            })
        }

        return interaction.reply({
            ephemeral: true,
            embeds: [infoEmbed('Server Settings',
                `\`visibility\`: \`${guild.visibility}\`\n
                \`admin-role\`: ${guild.adminRoleID ? `<@&${guild.adminRoleID}>` : null}\n
                \`map-role\`: ${guild.mapRoleID ? `<@&${guild.mapRoleID}>` : null}`
            )]
        })
	}
}