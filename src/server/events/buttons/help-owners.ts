import { Events, ButtonInteraction, Interaction } from 'discord.js';
import { infoEmbed } from '../../utils/embeds';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId);

        if (type !== 'help-owners') return;

        return { customID: { type }, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{}>;
    }) => {
        const serverOwnerDocs =
            "Set a server's settings with `/server-settings`. Using `/server-settings` for the first time without any options selected will save the defaults. Before the server owner uses `/server-settings`, the map is unavailable.";

        const serverRoles =
            'The admin role permits a server owner to authorizes members with a certain role to be able to change any server setting. Select a role to become the admin role with the `admin-role` option. Only the owner is allowed to change the admin role.\n\nThe map role allows admins/owners to restrict map access to members with a specific role. Set the map role with the `map-role` option. Remove the map or admin role with `remove-role`. `remove-role` does not delete the role from the server.';

        const mapVisibility =
            'The `visibility` option allows admins/owners to change who can view the server map. Setting `visibility` to `public` allows anyone with a link to view the map. Setting it to `member-restricted` allows only server members to view the map. Choosing `map-role-restricted` restricts the map to the owner and members with the map role. `admin-role-restricted` limits access to only the owner and members with the admin role. Selecting `invisible` hides the map from everyone (even admins), except the owner.';

        const defaults = '`visibility`: `public`\n`admin-role`: `null`\n`map-role`: `null`';

        interaction.reply({
            embeds: [
                infoEmbed(
                    null,
                    `# Server Owner Docs\n${serverOwnerDocs}\n### Server Roles\n${serverRoles}\n### Map Visibility\n${mapVisibility}\n### Defaults\n${defaults}
            `
                ),
            ],
            ephemeral: true,
        });
    },
};
