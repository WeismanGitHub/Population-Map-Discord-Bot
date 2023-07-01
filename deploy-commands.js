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
const supportServerCommands = [];
const globalCommands = [];

for (const path of commandsPaths) {
    const command = require(path);

    if (!Object.keys(command.default).every(key => ['globalCommand', 'data', 'execute'].includes(key))) {
        throw new Error('malformed command file...')
    }

    if (command.default.globalCommand) {
        globalCommands.push(command.default.data.toJSON());
    } else {
        supportServerCommands.push(command.default.data.toJSON());
    }
}

rest.put(
    Routes.applicationCommands(process.env.BOT_ID),
    { body: globalCommands },
).then(res => {
    console.log(`deployed ${globalCommands.length} global commands...`);
})

rest.put(
    Routes.applicationGuildCommands(process.env.BOT_ID, process.env.SUPPORT_SERVER_ID),
    { body: supportServerCommands },
).then(res => {
    console.log(`deployed ${supportServerCommands.length} support server commands...`);
})