import { getTopojson } from '../controllers/topojson'
import { Router } from 'express';

const topojsonRouter = Router();

topojsonRouter.get('/:countryCode?', getTopojson)

export default topojsonRouter