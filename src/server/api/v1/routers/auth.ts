import { Router } from 'express';
import {
    discordLogin,
    logout,
} from '../controllers/auth'

const authRouter: Router = Router();

authRouter.post('/logout', logout)
authRouter.post('/login', discordLogin)

export default authRouter