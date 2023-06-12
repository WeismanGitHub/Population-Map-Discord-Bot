import { Events, ButtonInteraction } from "discord.js"
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'help-owners') return

        const serverOwnerDocs = "Set your server's settings with `/server-settings`. Running `/server-settings` without any options selected just shows the server settings."

        const mapVisibility = "You can change the visibility of your server's map with the `visibility` option in `/server-settings`. Setting `visibility` to `public` allows anyone with a link to view your server's map. Setting it to `member-restricted` allows only server members to view the map. Choosing the `map-role-restricted` option restricts the map to members with a specific role. You need to set the map role with the `map-role` option."

        const adminRole = "admin role settings."

        interaction.reply({
            embeds: [infoEmbed(null, `
            # Server Owner Docs:\n${serverOwnerDocs}\n## Map Visibility:\n${mapVisibility}\n## Admin Role:\n${adminRole}
            `)],
            ephemeral: true
        })
    }
}