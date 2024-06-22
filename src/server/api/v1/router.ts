import { getBotInfo, getGuild, login, logout } from './controllers';
import expressSession from 'express-session';
import config from '../../config';
import { Router } from 'express';

require('express-async-errors');

const v1Router: Router = Router();
const session = expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'sessionID',
    cookie: {
        secure: config.mode === 'prod' ? true : false,
        httpOnly: true,
        sameSite: true,
        path: '/',
        maxAge: 1000 * 60 * 60,
    },
});

v1Router.get('/guilds/:guildID', session, getGuild);
v1Router.post('/discord/oauth2', session, login);
v1Router.post('/logout', session, logout);
v1Router.get('/bot', getBotInfo);

export default v1Router;
