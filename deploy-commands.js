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
const commands = [];

for (const path of commandsPaths) {
    const command = require(path);

    if (!command.default.data) {
        console.log(`malformed command file...`)
        continue
    }

    commands.push(command.default.data.toJSON());
}

rest.put(
    Routes.applicationCommands(process.env.BOT_ID),
    { body: commands },
).then(res => {
    console.log(`reloaded ${commands.length} commands...`);
})