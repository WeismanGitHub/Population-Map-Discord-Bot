import { TooManyRequestsError } from '../../../errors';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import express, { Router } from 'express';
import compression from 'compression'
import config from '../../../config'
require('express-async-errors')
import helmet from 'helmet'

import geojsonRouter from './geojson';
import authRouter from './auth';

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
v1Router.use(express.urlencoded({ extended: true }))
v1Router.use(express.json())

v1Router.use('/geojson', geojsonRouter)
v1Router.use('/auth', authRouter)

export default v1Router