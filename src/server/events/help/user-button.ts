import { Events, ButtonInteraction } from "discord.js"
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'help-users') return

        const userDocs = "Countries and subdivisions are from [ISO 3166](https://www.iso.org/iso-3166-country-codes.html). You can delete your data with `/user-delete`."

        const location = "Save your location with the `/location` command. You must choose your country and optionally your subdivision (state, region, prefecture, etc). Your location is the same across all servers, and it isn't shared with any servers automatically. You need to use `/add-location` in a server to add your location to the server's map. Use `/remove-location` anywhere to remove your location from any server's map."

        interaction.reply({
            embeds: [infoEmbed(null,
            `# User Docs\n${userDocs}\n### Location\n${location}
            `)],
            ephemeral: true
        })
    }
}