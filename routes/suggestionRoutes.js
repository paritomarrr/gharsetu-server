import express from 'express'
import {suggestPlaces} from '../controllers/suggestionController.js'

const SuggestionRoutes = express.Router()

SuggestionRoutes.post('/suggestPlaces', suggestPlaces)

export default SuggestionRoutes;