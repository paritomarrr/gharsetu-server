import express from 'express'
import {getCoordinates, suggestPlaces} from '../controllers/suggestionController.js'

const SuggestionRoutes = express.Router()

SuggestionRoutes.post('/suggestPlaces', suggestPlaces)
SuggestionRoutes.post('/getCoordinates', getCoordinates)

export default SuggestionRoutes;