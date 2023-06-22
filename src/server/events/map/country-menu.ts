import config from "../../config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    StringSelectMenuInteraction
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: StringSelectMenuInteraction) => {
        if (!interaction.isStringSelectMenu()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'map-country') return

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
            new ButtonBuilder()
            .setLabel('Server Map')
            .setStyle(ButtonStyle.Link)
            .setURL(`${config.websiteURL}/maps/${interaction.guildId}?countryCode=${interaction.values[0]}`)
		)

        interaction.reply({
            ephemeral: true,
            components: [row]
        })
    }
}