import { discordOAuth2, logout } from '../controllers/auth';
import { session } from '../middleware';
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/logout', session, logout);
authRouter.post('/discord/oauth2', session, discordOAuth2);

export default authRouter;
