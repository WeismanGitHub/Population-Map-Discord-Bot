import { Events, ButtonInteraction } from "discord.js"
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'help-users') return

        const userDocs = "Set your location with the `/location` command. You must choose your country and optionally your subdivision (state, region, prefecture, etc). The countries and subdivisions are from [ISO 3166](https://www.iso.org/iso-3166-country-codes.html). You can change your settings with `/user-settings`."

        interaction.reply({
            embeds: [infoEmbed(null,
            `# User Docs\n${userDocs}
            `)],
            ephemeral: true
        })
    }
}