import express, { Application, NextFunction, Request, Response } from 'express';
import { CustomError, NotFoundError, TooManyRequestsError } from './errors';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import v1Router from './api/v1/routers';
import compression from 'compression';
require('express-async-errors');
import { resolve } from 'path';
import config from './config';
import helmet from 'helmet';

const limiter = rateLimit({
    windowMs: config.limiterWindowMs,
    max: config.limiterMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, _next, _options) => {
        throw new TooManyRequestsError(config.limiterMessage);
    },
});

const api: Application = express();

api.use(helmet({
    contentSecurityPolicy: {
        directives: {
            'img-src': ["'self'", "cdn.discordapp.com", "raw.githubusercontent.com", "data:"],
            'default-src': ["'self'", "raw.githubusercontent.com"],
            'script-src': ["'self'"]
        },
    }
}));
api.use(limiter);
api.use(compression());
api.use(express.urlencoded({ extended: true }));
api.use(express.json());
api.use(
    fetchMetadata({
        allowedFetchSites: ['same-origin', 'same-site', 'none'],
        disallowedNavigationRequests: ['frame', 'iframe'],
        errorStatusCode: 403,
        allowedPaths: [],
        onError: (_req, res, _next, options) => {
            res.statusCode = options.errorStatusCode;
            res.end();
        },
    })
);

api.set('trust proxy', 1);
api.use(express.static(resolve(__dirname, '../client')));
api.use('/api/v1/', v1Router);

api.use('/api/*', (): void => {
    throw new NotFoundError('Route does not exist.');
});

api.get('/*', (_req, res): void => {
    res.status(200).sendFile(resolve(__dirname, '../client/index.html'));
});

api.use((err: Error | CustomError, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err.message);

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

export default api;
