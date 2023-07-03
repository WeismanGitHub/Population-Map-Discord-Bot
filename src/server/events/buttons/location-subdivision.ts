import { InternalServerError } from "../../errors"
import { CustomClient } from "../../custom-client"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Events,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const customID: CustomID<{ countryCode: string }> = JSON.parse(interaction.customId)

        if (customID.type !== 'location-subdivision') return

        return { customID, interaction }
    },
    execute: async ({ interaction, customID }: {
        interaction: ButtonInteraction,
        customID: CustomID<{ countryCode: string }>
    }) => {
        const client = interaction.client as CustomClient
        const { countryCode } = customID.data
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
                .setDisabled(country.sub.length < 25)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'location-subdivision-page',
                    data: { page: 1, countryCode }
                }))
        )

        interaction.update({ components: [menuRow, buttonsRow], embeds: [] })
    }
}