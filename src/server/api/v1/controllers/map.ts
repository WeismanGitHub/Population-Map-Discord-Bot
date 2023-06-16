import { ForbiddenError, NotFoundError } from '../../../errors';
import { Request, Response } from 'express';
import { Guild } from '../../../db/models';
require('express-async-errors')

async function getGuildMap(req: Request, res: Response): Promise<void> {
    const guildID = req.params.guildID

    const visibility = (await Guild.findOne({ where: { ID: guildID }, attributes: ['visibility'] }))?.visibility

    if (!visibility) {
        throw new NotFoundError('Server is not in database.')
    }

    if (visibility === 'invisibile') {
        throw new ForbiddenError('Server visibility is invisible.')
    }

    res.status(200).json()
}

export {
    getGuildMap,
}