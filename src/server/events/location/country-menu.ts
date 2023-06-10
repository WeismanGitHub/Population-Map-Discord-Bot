import {
    Events,
    StringSelectMenuInteraction
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: StringSelectMenuInteraction) => {
        if (!interaction.isStringSelectMenu()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'location-country') return

        console.log(interaction)
    }
}