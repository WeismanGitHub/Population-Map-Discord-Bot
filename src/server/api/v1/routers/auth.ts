import { discordLogin, logout } from '../controllers/auth'
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/logout', logout)
authRouter.post('/login', discordLogin)

export default authRouter