const { readdirSync, statSync } = require('fs');
const { REST, Routes } = require('discord.js');
const { join } = require('path')
require('dotenv').config();

function getPaths(dir) {
    const paths = readdirSync(dir)
    const filePaths = []

    function recursiveLoop(paths) {
        for (let path of paths) {
            const fileStat = statSync(path)
            
            if (fileStat.isFile()) {
                filePaths.push(path)
            } else if (fileStat.isDirectory()) {
                recursiveLoop(readdirSync(path).map(subPath => join(path, subPath)))
            }
        }
    }
    
    recursiveLoop(paths.map(path => join(dir, path)))
    
    return filePaths
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const commandsPaths = getPaths(join(__dirname, 'dist\\server\\commands')).filter(file => file.endsWith('.js'))
const globalCommands = [];
const guildCommands = {}

for (const path of commandsPaths) {
    const command = require(path).default;

    if (!Object.keys(command).every(key => ['guildIDs', 'data', 'execute'].includes(key))) {
        throw new Error('malformed command file...')
    }

    if (!command.guildIDs) {
        globalCommands.push(command.data.toJSON());
        continue
    }

    for (let guildID of command.guildIDs) {
        if (guildCommands[guildID]) {
            guildCommands[guildID].push(command.data.toJSON())
        } else {
            guildCommands[guildID] = [command.data.toJSON()]
        }
    }
}

rest.put(
    Routes.applicationCommands(process.env.BOT_ID),
    { body: globalCommands },
).then(res => {
    console.log(`deployed ${globalCommands.length} global commands...`);
})

Promise.all(Object.entries(guildCommands).map(([guildID, commands]) => {
    return rest.put(
        Routes.applicationGuildCommands(process.env.BOT_ID, guildID),
        { body: commands },
    )
})).then(() => {
    console.log(`deployed ${Object.entries(guildCommands).length} server commands...`)
})