import express from 'express'
import {propertiesTest, createProperty} from '../controllers/propertiesControllers.js'

const PropertiesRoutes = express.Router()

PropertiesRoutes.get('/', propertiesTest)
PropertiesRoutes.post('/create', createProperty)

export default PropertiesRoutes