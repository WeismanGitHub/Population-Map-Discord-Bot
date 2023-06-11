import { getCountryGeojson } from '../controllers/geojson'
import { Router } from 'express';

const geojsonRouter: Router = Router();

geojsonRouter.get('/countries/:code', getCountryGeojson)

export default geojsonRouter