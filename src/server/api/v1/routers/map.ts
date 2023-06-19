import { getGuildMap } from '../controllers/map'
import { session } from '../middleware';
import { Router } from 'express';

const mapRouter: Router = Router();

mapRouter.get('/guildID', session, getGuildMap)

export default mapRouter