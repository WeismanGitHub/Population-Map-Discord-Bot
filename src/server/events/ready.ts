import { CustomClient } from "../custom-client";
import { Events } from 'discord.js'

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client: CustomClient) {
        console.log('bot is ready...')
	},
};
