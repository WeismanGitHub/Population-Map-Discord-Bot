import { BadRequestError, InternalServerError } from "../../errors"
import { User } from "../../db/models"
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
        if (!interaction.isButton()) return

        const customID: CustomID<{ page: number }> = JSON.parse(interaction.customId)
        const { type } = customID
        
        if (type !== 'remove-location-page') {
            return
        }
        
        return { customID: customID, interaction }
    },
    execute: async ({ interaction, customID }: {
        interaction: ButtonInteraction,
        customID: CustomID<{ page: number }>
    }) => {
        const user = await User.findOne({ where: { discordID: interaction.user.id } })
        const { page } = customID.data

        if (!user || !user.guildIDs) {
            throw new InternalServerError('Could not find you in database.')
        }

        if (!user.guildIDs?.length) {
			throw new BadRequestError('You have not saved your location in any servers.')
		}

        const guilds = await Promise.all(user.guildIDs.map(guildID => {
			return interaction.client.guilds.fetch(guildID)
		}))

		const guildsRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(JSON.stringify({
                    type: 'remove-location',
                    data: {}
                }))
                .setPlaceholder('Select a server!')
                .addOptions(guilds.slice(page * 25, (page * 25) + 25).map(guild =>
					new StringSelectMenuOptionBuilder().setLabel(guild.name).setValue(guild.id)
				))
        )

		const pageButtonsRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
            new ButtonBuilder()
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'remove-location-page',
                    data: { page: page - 1 }
                }))
                .setDisabled(page <= 0),
            new ButtonBuilder()
                .setLabel('⏩')
				.setDisabled(guilds.length < 25)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(JSON.stringify({
                    type: 'remove-location-page',
                    data: { page: page + 1 }
                }))
        )

        interaction.update({
            components: [guildsRow, pageButtonsRow]
        })
    }
}