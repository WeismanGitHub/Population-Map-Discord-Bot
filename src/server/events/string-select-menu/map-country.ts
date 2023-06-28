import { country } from 'iso-3166-2'
import config from "../../config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    StringSelectMenuInteraction,
    LinkButtonComponentData
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: StringSelectMenuInteraction) => {
        if (!interaction.isStringSelectMenu()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'map-country') return

        const previousMapButtons = interaction.message.components[2].components.slice(0, 4)
        .map(({ data }) => {
            const { label, url, style } = data as LinkButtonComponentData

            return new ButtonBuilder()
                .setLabel(label || 'error')
                .setStyle(style)
                .setURL(url)
        })

        const mapButtons = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
            ...previousMapButtons,
            new ButtonBuilder()
                .setLabel(`${country(interaction.values[0])?.name} Map`)
                .setStyle(ButtonStyle.Link)
                .setURL(`${config.websiteURL}/maps/${interaction.guildId}?mapType=${interaction.values[0]}`)
		)

        interaction.update({
            components: [
                interaction.message.components[0],
                interaction.message.components[1],
                mapButtons
            ]
        })
    }
}