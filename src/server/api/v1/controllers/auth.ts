import { BadRequestError, InternalServerError } from '../../../errors';
import { Request, Response } from 'express';
import DiscordOauth2 from 'discord-oauth2'
import config from '../../../config';
require('express-async-errors');

async function discordOAuth2(req: Request, res: Response): Promise<void> {
    const oauth = new DiscordOauth2();
    const { code } = req.body

    if (!code) {
        throw new BadRequestError('Missing Code')
    }

    const accessToken = (await oauth.tokenRequest({
        clientId: config.botID,
        clientSecret: config.botSecret,
    
        code: code,
        scope: 'identify guilds',
        grantType: "authorization_code",
        redirectUri: config.redirectURI,
    }).catch(err => { throw new InternalServerError('Could not get user token') })).access_token

    const userID = (await oauth.getUser(accessToken)
    .catch(err => { throw new InternalServerError('Could not get user ID.') })).id

    req.session.userID = userID
    req.session.accessToken = accessToken

	res.status(200).end()
}

function logout(req: Request, res: Response): void {
    req.session.destroy((err) => {
        if (err) throw new InternalServerError('Could not delete session and log you out.')

        res.status(200).end()
    })
}

export {
    discordOAuth2,
    logout,
}