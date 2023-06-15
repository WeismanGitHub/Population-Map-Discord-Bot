import { discordOAuth2, logout } from '../controllers/auth'
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/logout', logout)
authRouter.post('/discord/oauth2', discordOAuth2)

export default authRouter