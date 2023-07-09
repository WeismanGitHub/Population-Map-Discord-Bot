import { Events, StringSelectMenuInteraction, Interaction } from "discord.js"
import { InternalServerError } from "../../errors";
import { infoEmbed } from "../../utils/embeds";
import { User } from "../../db/models";

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
        const user = await User.findOne({ where: { discordID: interaction.user.id } })
        const { guildID } = customID.data

        if (!user) {
            throw new InternalServerError('Could not find you in database.')
        }

        await user.removeLocationFromGuild(guildID)

        interaction.update({
            components: [],
            embeds: [infoEmbed('Removed location!')],
        })
    }
}