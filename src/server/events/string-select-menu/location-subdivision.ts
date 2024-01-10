import { Events, Interaction, StringSelectMenuInteraction } from "discord.js"
import { InternalServerError } from "../../errors";
import { GuildLocation } from "../../db/models";
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const { type }: CustomID<{ countryCode: string }> = JSON.parse(interaction.customId)

        if (type !== 'location-subdivision') return

        return { customID: { type }, interaction }
    },
    execute: async ({ interaction, customID }: { interaction: StringSelectMenuInteraction, customID: CustomID<{ countryCode: string }> } ) => {
        const subdivisionCode = interaction.values[0]
        const countryCode = customID.data.countryCode

        await GuildLocation.upsert({
            guildID: interaction.guildId!,
            userID: interaction.user.id,
            subdivisionCode,
            countryCode
        })
        .catch(err => { throw new InternalServerError('Could not save your subdivision.') })

        interaction.update({
            embeds: [infoEmbed('Selected a country and subdivision!')],
            components: []
        })
    }
}