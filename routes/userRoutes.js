import express from 'express'
import {userTest, saveUserDetails, bookmarkProperty, getBookmarkedProperties} from '../controllers/userControllers.js'
import { getSellerProfile, getSellerName } from '../controllers/sellerController.js'

const userRoutes = express.Router()

userRoutes.get('/', userTest)
userRoutes.post('/saveUserDetails', saveUserDetails)
userRoutes.post('/getSellerProfile', getSellerProfile)
userRoutes.post('/getSellerName', getSellerName)

userRoutes.post('/saveProperty', bookmarkProperty)
userRoutes.post('/getBookmarkedProperties', getBookmarkedProperties)

export default userRoutes 