import { Guild } from '../db/models'
import {
    SlashCommandBuilder,
    CommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('server-settings')
		.setDescription("Change your server's settings. Choosing no options just sends the settings.")
        .setDMPermission(false)
        .addRoleOption(option => option
            .setName('admin-role')
            .setDescription("Server members with the admin role can change server settings.")
        )
        .addRoleOption(option => option
            .setName('map-role')
            .setDescription("Server members with the map role can view the server map if `visibility` is set to `map-role`.")
        )
        .addStringOption(option => option
            .setName('visibility')
            .setDescription("Change who can view the server map.")
            .addChoices(
                { name: 'public', value: 'public' },
                { name: 'member-restricted', value: 'member-restricted' },
                { name: 'map-role-restricted', value: 'map-role-restricted' },
                { name: 'admin-role-restricted', value: 'admin-role-restricted' },
                { name: 'invisibile', value: 'invisibile' },
            )
        )
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        Guild
	}
}
// .addChoices(
//     { name: 'Overwhelmingly Positive', value: 'Overwhelmingly Positive'},
//     { name: 'Very Positive', value: 'Very Positive'},
//     { name: 'Positive', value: 'Positive'},
//     { name: 'Mostly Positive', value: 'Mostly Positive'},
//     { name: 'Mixed', value: 'Mixed'},
//     { name: 'Mostly Negative', value: 'Mostly Negative'},
//     { name: 'Negative', value: 'Negative'},
//     { name: 'Very Negative', value: 'Very Negative'},
//     { name: 'Overwhelmingly Negative', value: 'Overwhelmingly Negative'},
//     { name: 'No User Reviews', value: 'No user reviews'},
// )