import { CustomClient } from "../custom-client";
const { Events } = require('discord.js');

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: CustomClient) {
        console.log('bot is ready...')
	},
};
