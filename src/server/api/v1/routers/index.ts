import { TooManyRequestsError } from '../../../errors';
import config from '../../../config';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression'
require('express-async-errors')
import helmet from 'helmet'
import cors from 'cors'

const v1Router: Router = Router();

const limiter = rateLimit({
    windowMs: config.limiterWindowMs,
	max: config.limiterMax,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res, next, options) => { throw new TooManyRequestsError(config.limiterMessage) }
})

v1Router.use(helmet())

v1Router.use(fetchMetadata({
	allowedFetchSites: ['same-origin', 'same-site', 'none'],
	disallowedNavigationRequests: ['frame', 'iframe'],
	errorStatusCode: 403,
	allowedPaths: [],
	onError: (req, res, next, options) => {
		res.statusCode = options.errorStatusCode
		res.end()
	}
}))

v1Router.use(limiter)
v1Router.use(compression())
v1Router.use(cors({ origin: [`http://localhost:${config.appPort}`] }))
v1Router.use(express.urlencoded({ extended: true }))
v1Router.use(express.json())
v1Router.use(cookieParser())

export default v1Router