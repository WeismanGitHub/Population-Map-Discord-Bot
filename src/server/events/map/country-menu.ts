import { CustomClient } from "../../custom-client";
import { InternalServerError } from "../../errors";
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
        const client = interaction.client as CustomClient

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'map-country') return

        const countryCode = interaction.values[0]

        const country = client.getCountry(countryCode)

        if (!country) {
            throw new InternalServerError('Could not get country.')
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
            new ButtonBuilder()
            .setLabel('Server Map')
            .setStyle(ButtonStyle.Link)
            .setURL(`${config.websiteURL}/maps/${interaction.guildId}?countryCode=${countryCode}`)
		)

        interaction.update({
            components: [row]
        })
    }
}