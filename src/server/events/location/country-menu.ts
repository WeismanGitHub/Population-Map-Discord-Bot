import { infoEmbed } from "../../utils/embeds";
import User from "../../db/models/user";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    StringSelectMenuInteraction
} from "discord.js"
import { InternalServerError } from "../../errors";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: StringSelectMenuInteraction) => {
        if (!interaction.isStringSelectMenu()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'location-country') return

        const countryCode = interaction.values[0]

        User.upsert({ discordID: interaction.user.id, countryCode })
        .catch(err => { throw new InternalServerError('Could not save your country.') })

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
            .setLabel('Choose your subdivison (state, region, prefecture, etc)?')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(JSON.stringify({
                type: 'location-subdivision',
                data: { countryCode }
            }))
        )

        interaction.update({
            embeds: [infoEmbed('Make sure to choose your settings with `/settings`!')],
            components: [row]
        })
    }
}