import { getBotData } from '../controllers/bot';
import { Router } from 'express';

const botRouter: Router = Router();

botRouter.get('/', getBotData);

export default botRouter;
