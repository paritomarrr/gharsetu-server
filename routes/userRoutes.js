import express from 'express'
import {userTest, saveUserDetails} from '../controllers/userControllers.js'

const userRoutes = express.Router()

userRoutes.get('/', userTest)
userRoutes.post('/saveUserDetails', saveUserDetails)

export default userRoutes 