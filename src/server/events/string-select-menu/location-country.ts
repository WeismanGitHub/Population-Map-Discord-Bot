import { ForbiddenError, InternalServerError, NotFoundError } from '../../errors';
import { Guild, GuildLocation, User } from '../../db/models';
import { InfoEmbed } from '../../utils/embeds';
import iso31662 from '../../utils/countries';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
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

        const customID: CustomID<{}> = JSON.parse(interaction.customId);

        if (customID.type !== 'location-country') return;

        return { customID, interaction };
    },
    execute: async ({
        interaction,
    }: {
        interaction: StringSelectMenuInteraction;
        customID: CustomID<{}>;
    }) => {
        if (!interaction.inGuild()) return;

        const countryCode = interaction.values[0];

        const guild = await Guild.findOne({ where: { guildID: interaction.guildId } }).catch(() => {
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

        await User.upsert({ userID: interaction.user.id }).catch(() => {
            throw new InternalServerError('Could not write to database.');
        });

        await GuildLocation.upsert({
            guildID: interaction.guildId,
            userID: interaction.user.id,
            countryCode,
            subdivisionCode: null,
        }).catch(() => {
            throw new InternalServerError('Could not save your country.');
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

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('subdivisions')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(
                    JSON.stringify({
                        type: 'location-subdivision',
                        data: { countryCode },
                    })
                )
        );

        await interaction.update({
            embeds: [
                new InfoEmbed(
                    `Selected \`${iso31662.getCountry(countryCode).name}\`!`,
                    'You can also optionally choose a subdivision (state, region, prefecture, etc).'
                ),
            ],
            components: [row],
        });
    },
};
