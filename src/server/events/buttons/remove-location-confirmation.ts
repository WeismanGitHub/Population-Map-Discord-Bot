import { Events, StringSelectMenuInteraction, Interaction } from "discord.js"
import { InternalServerError } from "../../errors";
import { GuildLocation } from "../../db/models";
import { infoEmbed } from "../../utils/embeds";

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId)

        if (customID.type !== 'remove-location-confirmation') return

        return { customID, interaction }
    },
    execute: async ({ interaction, customID }: {
        interaction: StringSelectMenuInteraction,
        customID: CustomID<{ guildID: string }>
    }) => {
        const deletedRows = await GuildLocation.destroy({ where: { guildID: customID.data.guildID, userID: interaction.user.id } })

        if (!deletedRows) {
            throw new InternalServerError('Could not delete your data.')
        }

        interaction.update({
            components: [],
            embeds: [infoEmbed('Removed location!')],
        })
    }
}