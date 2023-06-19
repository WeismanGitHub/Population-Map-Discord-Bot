import { getGuildData } from '../controllers/guild'
import { session } from '../middleware';
import { Router } from 'express';

const guildRouter: Router = Router();

guildRouter.get('/guildID', session, getGuildData)

export default guildRouter