import express from 'express'
import {propertiesTest, createProperty, getAllProperties, getSingleProperty, filteredProperties ,getRecentProperties, deleteProperty, sellerProfile, searchPlaces, getAllPropertiesInCity, getPropertyReviews, submitPropertyReview, deletePropertyReview, filterPropertiesByShape} from '../controllers/propertiesControllers.js'

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
PropertiesRoutes.get('/:propertyId/reviews', getPropertyReviews)
PropertiesRoutes.post('/:propertyId/reviews', submitPropertyReview)
PropertiesRoutes.delete("/:propertyId/reviews/:reviewId", deletePropertyReview);
PropertiesRoutes.post('/filteredPropertiesByShape', filterPropertiesByShape);

export default PropertiesRoutes