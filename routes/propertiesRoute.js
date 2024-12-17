import express from 'express'
import {propertiesTest, createProperty, getAllProperties, getSingleProperty, filteredProperties ,getRecentProperties, deleteProperty, sellerProfile, searchPlaces, getAllPropertiesInCity} from '../controllers/propertiesControllers.js'

const PropertiesRoutes = express.Router()

PropertiesRoutes.get('/', propertiesTest)
PropertiesRoutes.post('/create', createProperty)
PropertiesRoutes.post('/getAllProperties', getAllProperties)
PropertiesRoutes.post('/getSingleProperty', getSingleProperty)
PropertiesRoutes.post('/getRecentProperties', getRecentProperties)
PropertiesRoutes.post('/deleteProperty', deleteProperty)
PropertiesRoutes.post('/sellerProfile', sellerProfile)
PropertiesRoutes.get('/searchArea', searchPlaces)
PropertiesRoutes.post('/filteredProperties', filteredProperties)
PropertiesRoutes.post('/getProertiesByCity', getAllPropertiesInCity)


export default PropertiesRoutes