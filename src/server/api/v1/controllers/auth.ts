import { BadRequestError, InternalServerError } from '../../../errors';
import { Request, Response } from 'express';
import DiscordOauth2 from 'discord-oauth2'
import { User } from '../../../db/models'
import config from '../../../config';
require('express-async-errors');
// import jwt from 'jsonwebtoken';

async function discordLogin(req: Request, res: Response): Promise<void> {
    const oauth = new DiscordOauth2();
    const { code } = req.body

    if (!code) {
        throw new BadRequestError('Missing Code')
    }

    const token = (await oauth.tokenRequest({
        clientId: config.botID,
        clientSecret: config.botSecret,
    
        code: code,
        scope: 'identify guilds',
        grantType: "authorization_code",
        redirectUri: config.redirectURI,
    }).catch(err => { throw new InternalServerError('Could not get user token') })).access_token

    const userID = (await oauth.getUser(token)
    .catch(err => { throw new InternalServerError('Could not get user ID.') })).id

    const guilds = (await oauth.getUserGuilds(token)
    .catch(err => { throw new InternalServerError('Could not get user guilds.') }))

    const user = await User.findOne({ where: { discordID: userID } })
    .catch(err => { throw new InternalServerError("Error finding user.") })

    console.log(userID, guilds, user)

    // figure out what to do with this info later

    // const userJWT = jwt.sign(
    //     { _id: userID, role: user.role },
    //     config.jwtSecret,
    //     { expiresIn: '14d' },
    // )

    // const expiration = new Date(Date.now() + (3600000 * 24 * 14)) // 14 days

	// res.status(200)
	// .cookie('user', userJWT, {
	// 	httpOnly: true,
	// 	secure: true,
	// 	sameSite: 'strict',
	// 	expires: expiration
	// })
	// .json({ role: user.role }).end()
}

function logout(req: Request, res: Response): void {
	res.status(200).clearCookie('user').end()
}

export {
    discordLogin,
    logout,
}