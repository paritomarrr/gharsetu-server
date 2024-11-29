import express from 'express'
import {userTest, saveUserDetails} from '../controllers/userControllers.js'
import { getSellerProfile, getSellerName } from '../controllers/sellerController.js'

const userRoutes = express.Router()

userRoutes.get('/', userTest)
userRoutes.post('/saveUserDetails', saveUserDetails)
userRoutes.post('/getSellerProfile', getSellerProfile)
userRoutes.post('/getSellerName', getSellerName)

export default userRoutes 