import { Events, ButtonInteraction, Interaction } from 'discord.js';
import { InfoEmbed } from '../../utils/embeds';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId);

        if (type !== 'help-owners') return;

        return { customID: { type }, interaction };
    },
    execute: async ({ interaction }: { interaction: ButtonInteraction; customID: CustomID<{}> }) => {
        const serverOwnerDocs = "Set a server's settings with `/server-settings`.";

        const serverRoles =
            "The `user role` is assigned to a member when they set their location and is removed when their location is deleted. You can lock your server behind this role, essentially forcing people set their locations. You **must** place the `Population Map Bot` role above the `user role` in your server's settings for it to work.\n\nServer members with the `admin role` can make changes to the server settings (except deleting server data). Only the owner is allowed to change the admin role.\n\nYou can make it so only people with the `map role` can see the map, but you also need to set the [map visibility](https://github.com/WeismanGitHub/Population-Map-Discord-Bot?tab=readme-ov-file#map-visibility).\n\nRemove the map, admin, or user role with the `remove-role` option. `remove-role` does not delete the role from the server.";

        const mapVisibility =
            'Owners/admins can change who can see the server map with the `visiblity` option. The `public` option lets anyone with a link see the map, `member-restricted` allows only members to see it, `map-role-restricted` authorizes people with the `map role`, and `admin-role-restricted` authorizes owners/admins. `invisible` hides the map from everyone, including owners/admins.';

        const defaults =
            '`visibility`: `public`\n`admin-role`: `null`\n`map-role`: `null`\n`user-role`: `null`';

        await interaction.reply({
            embeds: [
                new InfoEmbed(
                    null,
                    `# Server Owner Docs\n${serverOwnerDocs}\n### Server Roles\n${serverRoles}\n### Map Visibility\n${mapVisibility}\n### Defaults\n${defaults}
            `
                ),
            ],
            ephemeral: true,
        });
    },
};
