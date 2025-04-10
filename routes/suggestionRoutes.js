import express from 'express'
import {getCoordinates, suggestPlaces, suggestMainPlaces} from '../controllers/suggestionController.js'

const SuggestionRoutes = express.Router()

SuggestionRoutes.post('/suggestPlaces', suggestPlaces)
SuggestionRoutes.post('/getCoordinates', getCoordinates)
SuggestionRoutes.post('/suggestMainPlaces', suggestMainPlaces)

export default SuggestionRoutes;