import express from 'express'
import { userPropertiesTest, getUserProperties} from '../controllers/userPropertiesController.js'

const UserPropertiesRoutes = express.Router()

UserPropertiesRoutes.get('/test', userPropertiesTest)
UserPropertiesRoutes.post('/getUserProperties', getUserProperties)

export default UserPropertiesRoutes