const { getCountryGeoJSONByAlpha2 } = require('geojson-places')
import { BadRequestError } from '../../../errors';
import { Request, Response } from 'express';
require('express-async-errors')

async function getCountryGeojson(req: Request, res: Response): Promise<void> {
    const code = req.params.code

    const geojson: JSON | null = getCountryGeoJSONByAlpha2(code)

    if (!geojson) {
        throw new BadRequestError('Invalid country code.')
    }

    res.status(200).json(geojson)
}

export {
    getCountryGeojson,
}