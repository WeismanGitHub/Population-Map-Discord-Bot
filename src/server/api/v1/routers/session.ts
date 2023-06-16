import session from 'express-session';
import config from '../../../config';

export default session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true, httpOnly: true, sameSite: true, path: '/' }
})