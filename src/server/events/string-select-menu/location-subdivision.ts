import { Events, Interaction, StringSelectMenuInteraction } from "discord.js"
import { InternalServerError, NotFoundError } from "../../errors";
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
        
        const user = await User.findOne({ where: { discordID: interaction.user.id } })
        .catch(err => { throw new InternalServerError('An error occurred accessing the database..') })

        if (!user) {
            throw new NotFoundError('Could not find you in database.')
        }

        await user.updateLocation(null, subdivisionCode)

        interaction.update({
            embeds: [infoEmbed('Selected a country and subdivision!')],
            components: []
        })
    }
}