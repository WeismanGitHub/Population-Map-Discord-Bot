import { Router } from 'express';
require('express-async-errors');

import guildRouter from './guild';
import authRouter from './auth';
import botRouter from './bot';

const v1Router: Router = Router();

v1Router.use('/guilds', guildRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/bot', botRouter);

export default v1Router;
