import express from 'express'
import {propertiesTest, createProperty, getAllProperties, getSingleProperty, getRecentProperties, deleteProperty, sellerProfile} from '../controllers/propertiesControllers.js'

const PropertiesRoutes = express.Router()

PropertiesRoutes.get('/', propertiesTest)
PropertiesRoutes.post('/create', createProperty)
PropertiesRoutes.post('/getAllProperties', getAllProperties)
PropertiesRoutes.post('/getSingleProperty', getSingleProperty)
PropertiesRoutes.post('/getRecentProperties', getRecentProperties)
PropertiesRoutes.post('/deleteProperty', deleteProperty)
PropertiesRoutes.post('/sellerProfile', sellerProfile)

export default PropertiesRoutes