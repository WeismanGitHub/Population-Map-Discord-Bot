import { CustomClient } from '../../../custom-client';
import { Guild, GuildMap } from '../../../db/models';
import { Request, Response } from 'express';
import DiscordOauth2 from 'discord-oauth2'
require('express-async-errors')
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from '../../../errors';

async function getGuildData(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    const { accessToken, userID } = req.session
    const guildID = req.params.guildID
    const mapCode = req.query.mapCode
    const oauth = new DiscordOauth2()

    if (!guildID || !mapCode) {
        throw new BadRequestError('Missing map code or guild ID.')
    }

    const guildData = await Guild.findOne({
        where: { ID: guildID },
        attributes: ['visibility', 'adminRoleID', 'mapRoleID']
    }).catch(err => { throw new InternalServerError('Could not get server from database.') })

    if (!guildData) {
        throw new NotFoundError('Server is not in database.')
    }

    const { visibility, adminRoleID, mapRoleID } = guildData
    const guild = await client.guilds.fetch(guildID)
    
    if (visibility !== 'public') {
        if (!accessToken || !userID) {
            throw new UnauthorizedError('Unauthorized')
        }

        const guilds = await oauth.getUserGuilds(accessToken)
        .catch(err => { throw new InternalServerError('Could not get user guilds.') })

        if (!guilds.some((guild) => guild.id === guildID)) {
            throw new ForbiddenError('You are not in this server.')
        }

        if (visibility === 'invisibile') {
            throw new ForbiddenError('Server map visibility is invisible.')
        } else if (visibility === 'admin-role-restricted' && (!adminRoleID || !guild.roles.cache.has(adminRoleID))) {
            throw new ForbiddenError('Server map visibility is admin role restricted.')
        } else if (visibility === 'map-role-restricted' && (!mapRoleID || !guild.roles.cache.has(mapRoleID))) {
            throw new ForbiddenError('Server map visibility is map role restricted.')
        }
    }

    const guildMapData = await GuildMap.findOne({ where: { ID: guildID } })

    res.status(200)
    .json({
        locationsData: guildMapData,
        name: guild.name,
        iconURL: guild.iconURL(),
        guildMemberCount: guild.memberCount
    })
}

export {
    getGuildData,
}