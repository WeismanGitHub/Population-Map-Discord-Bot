import { ForbiddenError, InternalServerError, NotFoundError } from '../../errors';
import { Guild, GuildLocation } from '../../db/models';
import { InfoEmbed } from '../../utils/embeds';
import {
    Events,
    StringSelectMenuInteraction,
    Interaction,
    DiscordAPIError,
    PermissionFlagsBits,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId);

        if (customID.type !== 'remove-location-confirmation') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{ guildID: string }>;
    }) => {
        const guild = await Guild.findOne({ where: { guildID: customID.data.guildID } }).catch((err) => {
            throw new InternalServerError('Could not get this server.');
        });

        if (!guild) {
            throw new NotFoundError('This server has not been set up.');
        }

        if (
            guild.userRoleID &&
            !interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)
        ) {
            throw new ForbiddenError('Missing permissions to remove `user-role`.');
        }

        if (guild.userRoleID) {
            const member = await interaction.guild?.members.fetch(interaction.user.id);

            if (!member) {
                throw new NotFoundError('Could not find member.');
            }

            await member.roles.remove(guild.userRoleID).catch(async (err: DiscordAPIError) => {
                if (err.status === 404) {
                    throw new NotFoundError('Could not find `user-role`.');
                } else if (err.status == 403) {
                    throw new ForbiddenError('Missing permissions to remove `user-role`.');
                }

                throw new InternalServerError('Could not remove `user-role`.');
            });
        }

        const deletedRows = await GuildLocation.destroy({
            where: { guildID: customID.data.guildID, userID: interaction.user.id },
        });

        if (!deletedRows) {
            throw new InternalServerError('Could not delete your data.');
        }

        await interaction.update({
            components: [],
            embeds: [new InfoEmbed('Removed location!')],
        });
    },
};
