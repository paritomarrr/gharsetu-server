import express from 'express'
import {propertiesTest, createProperty, getAllProperties, getSingleProperty, propertiesInArea ,getRecentProperties, deleteProperty, sellerProfile, searchPlaces} from '../controllers/propertiesControllers.js'

const PropertiesRoutes = express.Router()

PropertiesRoutes.get('/', propertiesTest)
PropertiesRoutes.post('/create', createProperty)
PropertiesRoutes.post('/getAllProperties', getAllProperties)
PropertiesRoutes.post('/getSingleProperty', getSingleProperty)
PropertiesRoutes.post('/getRecentProperties', getRecentProperties)
PropertiesRoutes.post('/deleteProperty', deleteProperty)
PropertiesRoutes.post('/sellerProfile', sellerProfile)
PropertiesRoutes.get('/searchArea', searchPlaces)
PropertiesRoutes.post('/propertiesInArea', propertiesInArea)


export default PropertiesRoutes