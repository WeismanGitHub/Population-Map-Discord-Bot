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

        const { type, data }: CustomID<{ page: number }> = JSON.parse(interaction.customId)
        const client = interaction.client as CustomClient
        const { page } = data

        if (type !== 'location-country-page') {
            return
        }

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'location-country',
                    data: {}
                }))
                .setPlaceholder('Select your country!')
                .addOptions(
                    client.countries.slice(page * 25, (page * 25) + 25).map(country => 
                        new StringSelectMenuOptionBuilder()
                            .setLabel(country.name)
                            .setValue(country.code)
                    )
                )
        )

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page <= 0)
                .setCustomId(JSON.stringify({
                    type: 'location-country-page',
                    data: { page: page - 1 }
                })),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled((page + 1) * 25 >= client.countries.length)
                .setCustomId(JSON.stringify({
                    type: 'location-country-page',
                    data: { page: page + 1 }
                }))
        )

        interaction.update({ components: [menuRow, buttonsRow] })
    }
}