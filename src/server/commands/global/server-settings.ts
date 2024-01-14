import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMemberManager } from 'discord.js';
import { ForbiddenError, InternalServerError, NotFoundError } from '../../errors';
import { infoEmbed } from '../../utils/embeds';
import { Guild } from '../../db/models';

interface GuildSettings {
    visibility?:
        | 'public'
        | 'member-restricted'
        | 'map-role-restricted'
        | 'admin-role-restricted'
        | 'invisibile';
    mapRoleID?: string | null;
    adminRoleID?: string | null;
    userRoleID?: string | null;
}

export default {
    data: new SlashCommandBuilder()
        .setName('server-settings')
        .setDescription("Change your server's settings. Choosing no options just sends the settings.")
        .setDMPermission(false)
        .addRoleOption((option) =>
            option
                .setName('admin-role')
                .setDescription('Server members with the admin role can change server settings.')
        )
        .addRoleOption((option) =>
            option
                .setName('map-role')
                .setDescription(
                    'Server members with the map role can view the server map if visibility is set to map-role.'
                )
        )
        .addRoleOption((option) =>
            option.setName('user-role').setDescription('Users that have set their locations get this role.')
        )
        .addStringOption((option) =>
            option
                .setName('remove-role')
                .setDescription('Remove the admin or map role. Does not delete the role from your server.')
                .addChoices(
                    { name: 'admin-role', value: 'adminRoleID' },
                    { name: 'map-role', value: 'mapRoleID' },
                    { name: 'user-role', value: 'userRoleID' }
                )
        )
        .addStringOption((option) =>
            option
                .setName('visibility')
                .setDescription('Change who can view the server map.')
                .addChoices(
                    { name: 'public', value: 'public' },
                    { name: 'member-restricted', value: 'member-restricted' },
                    { name: 'map-role-restricted', value: 'map-role-restricted' },
                    { name: 'admin-role-restricted', value: 'admin-role-restricted' },
                    { name: 'invisibile', value: 'invisibile' }
                )
        ),
    guildIDs: null,
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) return;

        const visibilityChoice = interaction.options.getString('visibility') as
            | GuildSettings['visibility']
            | null;
        const removeRoleChoice = interaction.options.getString('remove-role');
        const adminRoleChoice = interaction.options.getRole('admin-role');
        const userRoleChoice = interaction.options.getRole('user-role');
        const mapRoleChoice = interaction.options.getRole('map-role');
        const settings: GuildSettings = {};

        if (visibilityChoice) {
            settings.visibility = visibilityChoice;
        }

        if (adminRoleChoice) {
            settings.adminRoleID = adminRoleChoice.id;
        }

        if (mapRoleChoice) {
            settings.mapRoleID = mapRoleChoice.id;
        }

        if (userRoleChoice) {
            settings.userRoleID = userRoleChoice.id;
        }

        if (removeRoleChoice) {
            settings[removeRoleChoice as 'adminRoleID' | 'mapRoleID' | 'userRoleID'] = null;
        }

        let guild = await Guild.findOne({ where: { guildID: interaction.guildId } });
        const thereAreChanges = Boolean(Object.keys(settings).length);

        if (thereAreChanges || interaction.user.id === interaction.guild?.ownerId) {
            if (interaction.user.id === interaction.guild?.ownerId) {
                const res = await Guild.upsert({
                    guildID: interaction.guildId!,
                    ...settings,
                }).catch((err) => {
                    throw new InternalServerError('Could not save server settings.');
                });

                guild = res[0];
            } else if (guild) {
                const roles = (interaction.member.roles as unknown as GuildMemberManager).cache;
                const userIsAdmin = guild.adminRoleID ? roles.has(guild.adminRoleID) : false;

                if (!userIsAdmin) {
                    throw new ForbiddenError('Only admins and the owner can change server settings.');
                }

                if (settings.adminRoleID !== undefined) {
                    throw new ForbiddenError('Admins cannot edit the admin role.');
                }

                await guild.update(settings).catch((err) => {
                    throw new InternalServerError('Could not save server settings.');
                });
            }
        }

        if (!guild) {
            throw new NotFoundError(
                'This server has not been set up. The server owner must use `/server-settings`.'
            );
        }

        return interaction.reply({
            ephemeral: true,
            embeds: [
                infoEmbed(
                    'Server Settings',
                    `\`visibility\`: \`${guild.visibility}\`
                \`admin-role\`: ${guild.adminRoleID ? `<@&${guild.adminRoleID}>` : '`null`'}
                \`map-role\`: ${guild.mapRoleID ? `<@&${guild.mapRoleID}>` : '`null`'}
                \`user-role\`: ${guild.userRoleID ? `<@&${guild.userRoleID}>` : '`null`'}`
                ),
            ],
        });
    },
};
