import { Events, ButtonInteraction, Interaction } from 'discord.js';
import { infoEmbed } from '../../utils/embeds';

export default {
    name: Events.InteractionCreate,
    once: false,
    check: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId);

        if (type !== 'help-users') return;

        return { customID: { type }, interaction };
    },
    execute: async ({
        interaction,
        customID,
    }: {
        interaction: ButtonInteraction;
        customID: CustomID<{}>;
    }) => {
        const userDocs =
            'You can delete your data with `/user-delete`. Your location should be automatically removed from a server map if you leave or are kicked/banned, but this will not work if the bot is offline. Use `/remove-location` if your location is not automatically removed.';

        const location =
            'Add your location to a server map with the `/set-location` command. Use `/remove-location` anywhere to remove your location from a server map. Use `/view-location` to see your location in a server.';

        interaction.reply({
            embeds: [infoEmbed(null, `# User Docs\n${userDocs}\n### Location\n${location}`)],
            ephemeral: true,
        });
    },
};
