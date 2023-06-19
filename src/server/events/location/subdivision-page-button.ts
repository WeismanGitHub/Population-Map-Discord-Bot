import { CustomClient } from "../../custom-client"
import { InternalServerError } from "../../errors"
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

        const { type, data }: CustomID<{ page: number, countryCode: string }> = JSON.parse(interaction.customId)
        const client = interaction.client as CustomClient
        const { page, countryCode } = data

        if (type !== 'location-subdivision-page') {
            return
        }

        const country = client.getCountry(countryCode)

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
                    country.sub.slice(page * 25, (page * 25) + 25).map(subdivision => 
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
                .setDisabled(page <= 0)
                .setCustomId(JSON.stringify({
                    type: 'location-subdivision-page',
                    data: { page: page - 1, countryCode }
                })),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled((page + 1) * 25 >= country.sub.length)
                .setCustomId(JSON.stringify({
                    type: 'location-subdivision-page',
                    data: { page: page + 1, countryCode }
                }))
        )

        interaction.update({ components: [menuRow, buttonsRow] })
    }
}