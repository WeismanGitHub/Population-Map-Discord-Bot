import { ForbiddenError, InternalServerError, NotFoundError } from '../../errors';
import { Guild, GuildLocation } from '../../db/models';
import { InfoEmbed } from '../../utils/embeds';
import {
    DiscordAPIError,
    Events,
    Interaction,
    PermissionFlagsBits,
    StringSelectMenuInteraction,
} from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID: CustomID<{ countryCode: string }> = JSON.parse(interaction.customId);

        if (customID.type !== 'location-subdivision') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{ countryCode: string }>;
    }) => {
        if (!interaction.inGuild()) return;

        const guild = await Guild.findOne({ where: { guildID: interaction.guildId } }).catch((err) => {
            throw new InternalServerError('Could not get this server.');
        });

        if (!guild) {
            throw new InternalServerError('This server has not been set up.');
        }

        if (
            guild.userRoleID &&
            !interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)
        ) {
            throw new ForbiddenError('Missing permissions to add `user-role`.');
        }

        const subdivisionCode = interaction.values[0];
        const countryCode = customID.data.countryCode;

        await GuildLocation.upsert({
            guildID: interaction.guildId!,
            userID: interaction.user.id,
            subdivisionCode,
            countryCode,
        }).catch((err) => {
            throw new InternalServerError('Could not save your subdivision.');
        });

        if (guild.userRoleID) {
            const member = await interaction.guild?.members.fetch(interaction.user.id);

            if (!member) {
                throw new NotFoundError('Could not find member.');
            }

            await member.roles.add(guild.userRoleID).catch(async (err: DiscordAPIError) => {
                await GuildLocation.destroy({
                    where: { userID: interaction.user.id, guildID: interaction.guildId },
                });

                if (err.status === 404) {
                    throw new NotFoundError('Could not find `user-role`.');
                } else if (err.status == 403) {
                    throw new ForbiddenError(
                        'Missing permissions to add `user-role`. Make sure the `Population Map Bot` role is above the `user-role` in the server settings.'
                    );
                }

                throw new InternalServerError('Could not add `user-role`.');
            });
        }

        await interaction.update({
            embeds: [new InfoEmbed('Selected a country and subdivision!')],
            components: [],
        });
    },
};
