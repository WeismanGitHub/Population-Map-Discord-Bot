import { BadRequestError } from '../../../errors';
import { Request, Response } from 'express';
require('express-async-errors')

async function getGuildMap(req: Request, res: Response): Promise<void> {
    const guildID = req.params.guildID


    res.status(200).json()
}

export {
    getGuildMap,
}