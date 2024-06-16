import { User, GuildLocation, Guild} from "./db/models";
import fs from 'fs';

async function download() {
    const users = JSON.stringify((await User.findAll()).map(user => {
        return {
            userID: user.userID,

        }
    }))

    fs.writeFileSync('users.json', users);

    const guilds = JSON.stringify((await Guild.findAll()).map(guild => {
        return {
            guildID: guild.guildID,
            visibility: guild.visibility,
            mapRoleID: guild.mapRoleID,
            adminRoleID: guild.adminRoleID,
            userRoleID: guild.userRoleID
        }
    }))

    fs.writeFileSync('guilds.json', guilds);

    const guildLocations = JSON.stringify((await GuildLocation.findAll()).map(location => {
        return {
            userID: location.userID,
            guildID: location.guildID,
            subdivisionCode: location.subdivisionCode,
            countryCode: location.countryCode

        }
    }), null, 4)

    fs.writeFileSync('guild-locations.json', guildLocations);
}

async function upload() {
    const users: User[] = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    const guilds: Guild[] = JSON.parse(fs.readFileSync('guilds.json', 'utf8'));
    const guildLocations: GuildLocation[] = JSON.parse(fs.readFileSync('guild-locations.json', 'utf8'));
    
    await User.bulkCreate(users)
    await Guild.bulkCreate(guilds)
    await GuildLocation.bulkCreate(guildLocations)
}

download
upload