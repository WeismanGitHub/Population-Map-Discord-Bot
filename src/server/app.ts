import express, { Application, NextFunction, Request, Response } from 'express';
import { CustomError, NotFoundError } from './errors';
import v1Router from './api/v1/routers';
require('express-async-errors');
import { resolve } from 'path';

const app: Application = express();

app.set('trust proxy', 1);
app.use(express.static(resolve(__dirname, '../client')));
app.use('/api/v1/', v1Router);

app.use('/api/*', (): void => {
    throw new NotFoundError('Route does not exist.');
});

app.get('/*', (_req, res): void => {
    res.status(200).sendFile(resolve(__dirname, '../client/index.html'));
});

app.use((err: Error | CustomError, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err.message);

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

export default app;
