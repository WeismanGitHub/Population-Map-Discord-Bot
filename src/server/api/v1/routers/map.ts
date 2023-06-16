import { getGuildMap } from '../controllers/map'
import { Router } from 'express';

const mapRouter: Router = Router();

mapRouter.get('/guildID', getGuildMap)

export default mapRouter