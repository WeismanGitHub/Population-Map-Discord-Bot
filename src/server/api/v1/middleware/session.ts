import session from 'express-session';
import config from '../../../config';

export default session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: config.production ? true : false,
		httpOnly: true,
		sameSite: true,
		path: '/',
		maxAge: 1000 * 60 * 60 * 24
	},
})