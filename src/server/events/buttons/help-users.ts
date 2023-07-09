import { Events, ButtonInteraction, Interaction } from "discord.js"
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'help-users') return

        return { customID: { type }, interaction }
    },
    execute: async ({ interaction, customID }: { interaction: ButtonInteraction, customID: CustomID<{}> } ) => {
        const userDocs = "You can delete your data with `/user-delete`. Your location is automatically removed from a server map if you are kicked/banned/leave the server."

        const location = "Save your location with the `/set-location` command. You must choose your country and optionally your subdivision (state, region, prefecture, etc). Your location is the same across all servers, and isn't shared with any servers automatically. You need to manually use `/add-location` in a server to add your location to the server's map. Use `/remove-location` anywhere to remove your location from any map."

        const userSettings = "View your settings/location by using `/user-settings` with no options selected. To have your location automatically added when you join a server, use the `add-location-on-join` option in `/user-settings`. `add-location-on-join` is off by default."

        interaction.reply({
            embeds: [infoEmbed(null,
            `# User Docs\n${userDocs}\n### Location\n${location}\n### User Settings\n${userSettings}
            `)],
            ephemeral: true
        })
    }
}