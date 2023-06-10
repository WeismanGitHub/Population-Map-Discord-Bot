import {
    ButtonInteraction,
    Events,
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { type, data }: CustomID<{ countryCode: string }> = JSON.parse(interaction.customId)
        const { countryCode } = data

        if (type !== 'location-subdivision') {
            return
        }

        console.log(countryCode)
    }
}