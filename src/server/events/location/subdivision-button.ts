import { InternalServerError } from "../../errors"
import { CustomClient } from "../../custom-client"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Events,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { type, data }: CustomID<{ countryCode: string }> = JSON.parse(interaction.customId)
        const client = interaction.client as CustomClient
        const { countryCode } = data

        if (type !== 'location-subdivision') {
            return
        }

        const country = client.countries.find((country) => country.code === countryCode)

        if (!country) {
            throw new InternalServerError('Could not get country.')
        }

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'location-subdivision',
                    data: {}
                }))
                .setPlaceholder('Select your subdivision!')
                .addOptions(
                    country.sub.slice(0, 25).map(subdivision => 
                        new StringSelectMenuOptionBuilder()
                            .setLabel(subdivision.name)
                            .setValue(subdivision.code)
                    )
                )
        )

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('0')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'location-subdivision-page',
                    data: { page: 1, countryCode }
                }))
        )

        interaction.update({ components: [menuRow, buttonsRow], embeds: [] })
    }
}