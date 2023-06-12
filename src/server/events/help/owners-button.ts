import { Events, ButtonInteraction } from "discord.js"
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'help-owners') return

        const serverOwnerDocs = "Set a server's settings with `/server-settings`. Running `/server-settings` without any options selected just shows the server settings."

        const serverRoles = "The admin role permits a server owner to authorizes members with a certain role to be able to change any server setting. Select a role to become the admin role with the `admin-role` option. Only the server owner is allowed to change the admin role.\n\nThe map role allows admins/owners to restrict map access to members with a role. Set the map role with the `map-role` option."
        
        const mapVisibility = "The `visibility` option allows admins/owners to change who can view the server map. Setting `visibility` to `public` allows anyone with a link to view the server map. Setting it to `member-restricted` allows only server members to view the map. Choosing `map-role-restricted` restricts the map to the server owner and members with the map role. The `admin-role-restricted` choice limits access to only the server owner and members with the admin role. Selecting `invisible` blocks the map to everyone, including server owners and admins."

        const defaults = "`visibility`: `member-restricted`\n`admin-role`: `null`\n`map-role`: `null`"

        interaction.reply({
            embeds: [infoEmbed(null,
            `# Server Owner Docs\n${serverOwnerDocs}\n## Server Roles\n${serverRoles}\n## Map Visibility\n${mapVisibility}\n## Defaults\n${defaults}
            `)],
            ephemeral: true
        })
    }
}