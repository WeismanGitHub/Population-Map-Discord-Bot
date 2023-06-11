import { BadRequestError, InternalServerError } from '../../../errors';
const DiscordOauth2 = require("discord-oauth2");
// import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import config from '../../../config';
require('express-async-errors');
import jwt from 'jsonwebtoken';

async function discordLogin(req: Request, res: Response): Promise<void> {
    const oauth = new DiscordOauth2();
    let userID: string | undefined;
    const { code } = req.body

    if (!code) {
        throw new BadRequestError('Missing Code')
    }

    try {
        const token: string = (await oauth.tokenRequest({
            clientId: config.botID,
            clientSecret: config.botSecret,
        
            code: code,
            scope: 'identify guilds',
            grantType: "authorization_code",
            redirectUri: config.redirectURI,
        })).access_token

        userID = (await oauth.getUser(token)).id
    } catch(err) {
        throw new InternalServerError('Could not get user ID.')
    }

    if (!userID) {
        throw new InternalServerError('Could not get user ID.')
    }

    const user = await UserModel.findOne({ _id: userID }).lean()
    .catch((err: Error) => {
        throw new InternalServerError("Error finding user.")
    })

    if (!user) {
        throw new UnauthorizedError("You need to register first.")
    }

    const userJWT = jwt.sign(
        { _id: userID, role: user.role },
        config.jwtSecret,
        { expiresIn: '14d' },
    )

    const expiration = new Date(Date.now() + (3600000 * 24 * 14)) // 14 days

	res.status(200)
	.cookie('user', userJWT, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		expires: expiration
	})
	.json({ role: user.role }).end()
}

function logout(req: Request, res: Response): void {
	res.status(200).clearCookie('user').end()
}

export {
    discordLogin,
    logout,
}