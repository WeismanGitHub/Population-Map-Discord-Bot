import { CustomClient } from "../custom-client"
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

        const { type, data }: CustomID<{ page: number, countrySelectType: string }> = JSON.parse(interaction.customId)
        const client = interaction.client as CustomClient
        const { page, countrySelectType } = data

        if (type !== 'country-page') {
            return
        }

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: countrySelectType,
                    data: {}
                }))
                .setPlaceholder('Select a country!')
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
                    type: 'country-page',
                    data: { page: page - 1, countrySelectType }
                })),
            new ButtonBuilder()
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled((page + 1) * 25 >= client.countries.length)
                .setCustomId(JSON.stringify({
                    type: 'country-page',
                    data: { page: page + 1, countrySelectType }
                }))
        )

        interaction.update({ components: [menuRow, buttonsRow] })
    }
}