import { Guild, GuildLocation } from '../../db/models';
import { CustomClient } from '../../custom-client';
import { Request, Response } from 'express';
import DiscordOauth2 from 'discord-oauth2';
import config from '../../config';
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from '../../errors';

require('express-async-errors');

async function getGuild(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient');
    const { accessToken, userID } = req.session;
    const mapCode = req.query.mapCode as 'CONTINENTS' | 'WORLD' | string;
    const guildID = req.params.guildID;
    const oauth = new DiscordOauth2();

    if (!guildID || !mapCode) {
        throw new BadRequestError('Missing map code or guild ID.');
    }

    const guildData = await Guild.findOne({
        where: { guildID },
        attributes: ['visibility', 'adminRoleID', 'mapRoleID'],
    }).catch(() => {
        throw new InternalServerError('Could not get server from database.');
    });

    if (!guildData) {
        throw new NotFoundError('Server is not in database.');
    }

    const { visibility, adminRoleID, mapRoleID } = guildData;
    const fullGuild = await client.guilds.fetch(guildID);

    if (visibility === 'invisibile') {
        throw new ForbiddenError('Server map visibility is invisible.');
    } else if (visibility !== 'public') {
        if (!accessToken || !userID) {
            throw new UnauthorizedError('You must log in to see this map.');
        }

        const guilds = await oauth.getUserGuilds(accessToken).catch(() => {
            throw new InternalServerError('Could not get user servers.');
        });

        const partialGuild = guilds.find((guild) => guild.id === guildID);

        if (!partialGuild) {
            throw new ForbiddenError('You are not in this server.');
        }

        if (!partialGuild.owner) {
            const userID = (
                await oauth.getUser(accessToken).catch(() => {
                    throw new InternalServerError('Could not get user data.');
                })
            ).id;

            const user = await fullGuild.members.fetch(userID).catch(() => {
                throw new InternalServerError('Could not get user data.');
            });

            if (
                visibility === 'admin-role-restricted' &&
                !user.roles.cache.some((role) => role.id === adminRoleID)
            ) {
                throw new ForbiddenError('This map is restricted to members with the admin role.');
            } else if (
                visibility === 'map-role-restricted' &&
                !user.roles.cache.some((role) => role.id === mapRoleID)
            ) {
                throw new ForbiddenError('This map is restricted to members with the map role.');
            }
        }
    }

    const filter = ['CONTINENTS', 'WORLD'].includes(mapCode) ? {} : { countryCode: mapCode };
    const locations = await GuildLocation.findAll({
        where: { guildID, ...filter },
        attributes: ['countryCode', 'subdivisionCode'],
    }).catch(() => {
        throw new InternalServerError(
            "Could not get country data. Please verify that you've set and added your location to this server."
        );
    });

    res.status(200).json({
        locations: locations,
        name: fullGuild.name,
        icon: fullGuild.iconURL(),
        guildMemberCount: fullGuild.memberCount,
    });
}

async function getBotInfo(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient');

    res.status(200).json({
        guildCount: client.guilds.cache.size,
    });
}

async function login(req: Request, res: Response): Promise<void> {
    const oauth = new DiscordOauth2();
    const { code } = req.body;

    if (!code) {
        throw new BadRequestError('Missing Code');
    }

    const accessToken = (
        await oauth
            .tokenRequest({
                clientId: config.botID,
                clientSecret: config.botSecret,

                code: code,
                scope: 'identify guilds',
                grantType: 'authorization_code',
                redirectUri: config.redirectURI,
            })
            .catch(() => {
                throw new InternalServerError('Could not get user token');
            })
    ).access_token;

    const userID = (
        await oauth.getUser(accessToken).catch(() => {
            throw new InternalServerError('Could not get user ID.');
        })
    ).id;

    req.session.userID = userID;
    req.session.accessToken = accessToken;

    res.status(200).end();
}

function logout(req: Request, res: Response): void {
    req.session.destroy((err) => {
        if (err) throw new InternalServerError('Could not delete session and log you out.');

        res.status(200).clearCookie('sessionID').end();
    });
}

export { getGuild, getBotInfo, login, logout };
