const { readdirSync, statSync } = require('fs');
const { REST, Routes } = require('discord.js');
const { join } = require('path');
require('dotenv').config();

const filePaths = [];
function getPaths(path) {
    const fileStat = statSync(path);

    if (fileStat.isFile() && path.endsWith('.js')) {
        filePaths.push(path);
    } else if (fileStat.isDirectory()) {
        for (const subPath of readdirSync(path)) {
            getPaths(join(path, subPath));
        }
    }

    return filePaths;
}

const commandsPaths = getPaths(join(__dirname, 'dist\\server\\commands'), []);

(async () => {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    const globalCommands = [];
    const guildCommands = {};

    for (const path of commandsPaths) {
        const command = require(path).default;

        if (!Object.keys(command).every((key) => ['guildIDs', 'data', 'execute'].includes(key))) {
            throw new Error('malformed command file...');
        }

        if (!command.guildIDs) {
            globalCommands.push(command.data.toJSON());
            continue;
        }

        for (let guildID of command.guildIDs) {
            if (guildCommands[guildID]) {
                guildCommands[guildID].push(command.data.toJSON());
            } else {
                guildCommands[guildID] = [command.data.toJSON()];
            }
        }
    }

    const data = await rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: globalCommands });

    console.log(`deployed ${data.length} global commands...`);

    await Promise.all(
        Object.entries(guildCommands).map(([guildID, commands]) => {
            return rest.put(Routes.applicationGuildCommands(process.env.BOT_ID, guildID), { body: commands });
        })
    );

    console.log(`deployed ${Object.entries(guildCommands).length} server commands...`);
})();
