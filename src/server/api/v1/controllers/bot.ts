import { CustomClient } from '../../../custom-client';
import { Request, Response } from 'express';
import config from '../../../config';
require('express-async-errors')

async function getBotData(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')

    res.status(200).json({
        guildCount: client.guilds.cache.size,
        botInviteURL: config.botInvite,
        supportServerInvite: config.supportServerInvite,
        githubURL: config.githubURL,
        buyMeACoffeeURL: config.buyMeACoffeeURL,
    })
}

export {
    getBotData,
}