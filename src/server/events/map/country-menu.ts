import { InternalServerError } from "../../errors";
import config from "../../config";
import { whereAlpha2 } from 'iso-3166-1'
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

        const countryCode = whereAlpha2(interaction.values[0])?.alpha3

        if (!countryCode) {
            throw new InternalServerError('Could not find country.')
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