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

        const serverRoles = "The admin role permits a server owner to allow members with a certain role to be able to change any server setting. Select a role to become the admin role with the `admin-role` option.\n\nThe map role allows you to restrict map access to members with a role. You need to set the map role with the `map-role` option."
        
        const mapVisibility = "You can change the visibility of your server's map with the `visibility` option in `/server-settings`. Setting `visibility` to `public` allows anyone with a link to view your server's map. Setting it to `member-restricted` allows only server members to view the map. Choosing `map-role-restricted` restricts the map to members with the map role. The `admin-role-restricted` choice limits access to only members with the admin role."

        interaction.reply({
            embeds: [infoEmbed(null,
                `# Server Owner Docs:\n${serverOwnerDocs}\n## Server Roles:\n${serverRoles}\n## Map Visibility:\n${mapVisibility}
            `)],
            ephemeral: true
        })
    }
}