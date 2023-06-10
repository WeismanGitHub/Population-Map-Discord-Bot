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
        const { countryCode } = data

        if (type !== 'location-subdivision') {
            return
        }

        // @ts-ignore
        const country = interaction.client.countries.find((country) => country.code === countryCode)

        const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'location-subdivision',
                    data: {}
                }))
                .setPlaceholder('Select your subdivision!')
                .addOptions(
                    // @ts-ignore
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
                    data: { page: 1 }
                }))
        )

        interaction.update({ components: [menuRow, buttonsRow], embeds: [] })
    }
}