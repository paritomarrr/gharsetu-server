import express from 'express'
import {propertiesTest} from '../controllers/propertiesControllers.js'

const PropertiesRoutes = express.Router()

PropertiesRoutes.get('/', propertiesTest)

export default PropertiesRoutes