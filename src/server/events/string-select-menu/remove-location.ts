import { guildEmbed } from '../../utils/embeds';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    StringSelectMenuInteraction,
    Interaction
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId)

        if (customID.type !== 'remove-location') return

        return { customID, interaction }
    },
    execute: async ({ interaction, customID }: {
        interaction: StringSelectMenuInteraction,
        customID: CustomID<{}>
    }) => {
        const guildID = interaction.values[0]

        const guild = await interaction.client.guilds.fetch(guildID)

        const confirmationButtonRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
            new ButtonBuilder()
                .setLabel(`Remove Location?`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'remove-location-confirmation',
                    data: {}
                }))
		)

        interaction.update({
            embeds: [guildEmbed(guild)],
            components: [confirmationButtonRow]
        })
    }
}