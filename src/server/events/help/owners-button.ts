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

        const mapVisibility = "map visibility settings."

        const adminRole = "admin role settings."

        interaction.reply({
            embeds: [infoEmbed(null, `
            # Server Owner Docs:\n${serverOwnerDocs}\n## Map Visibility:\n${mapVisibility}\n## Admin Role:\n${adminRole}
            `)],
            ephemeral: true
        })
    }
}