import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { InfoEmbed } from '../../utils/embeds';
import { NotFoundError } from '../../errors';
import { User } from '../../db/models';

export default {
    data: new SlashCommandBuilder().setName('user-delete').setDescription('Delete all your data.'),
    guildIDs: null,
    async execute(interaction: ChatInputCommandInteraction) {
        const deletedRows = await User.destroy({ where: { userID: interaction.user.id } });

        if (deletedRows === 0) {
            throw new NotFoundError('Could not find you in the database.');
        }

        interaction.reply({
            ephemeral: true,
            embeds: [new InfoEmbed('Your data has been deleted.')],
        });
    },
};
