import { InternalServerError } from "../../errors";
import { infoEmbed } from "../../utils/embeds";
import { User } from "../../db/models";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    Interaction,
    StringSelectMenuInteraction
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        const customID: CustomID<{}> = JSON.parse(interaction.customId)

        if (customID.type !== 'location-country') return

        return { customID, interaction }
    },
    execute: async ({ interaction, customID }: {
        interaction: StringSelectMenuInteraction,
        customID: CustomID<{ countryCode: string }>
    }) => {
        const countryCode = interaction.values[0]
        
        const user = await User.findOne({ where: { discordID: interaction.user.id } })
        .catch(err => { throw new InternalServerError('An error occurred accessing the database..') })

        if (!user) {
            await User.create({ discordID: interaction.user.id, countryCode })
            .catch(err => { throw new InternalServerError('Could not save your country.') })
        } else {
            await user.updateLocation(countryCode, null)
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
            .setLabel('subdivisions')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(JSON.stringify({
                type: 'location-subdivision',
                data: { countryCode }
            }))
        )

        interaction.update({
            embeds: [infoEmbed('Selected a country!', 'You can also optionally choose your subdivision (state, region, prefecture, etc).')],
            components: [row]
        })
    }
}