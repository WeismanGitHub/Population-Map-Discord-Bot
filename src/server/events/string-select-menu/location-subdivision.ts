import { Events, Interaction, StringSelectMenuInteraction } from "discord.js"
import { InternalServerError } from "../../errors";
import { infoEmbed } from "../../utils/embeds";
import { User } from "../../db/models";

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'location-subdivision') return

        return { customID: { type }, interaction }
    },
    execute: async ({ interaction, customID }: { interaction: StringSelectMenuInteraction, customID: CustomID<{}> } ) => {
        const subdivisionCode = interaction.values[0]
        
        // is this inefficient? the database probably won't stop looking for rows to update even after finding a match
        User.update({ subdivisionCode }, { where: { discordID: interaction.user.id } })
        .catch(err => { throw new InternalServerError('Could not save your subdivision.') })

        interaction.update({
            embeds: [infoEmbed('Selected a country and subdivision!')],
            components: []
        })
    }
}