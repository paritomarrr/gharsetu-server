import express from 'express'
import {userTest} from '../controllers/userControllers.js'

const userRoutes = express.Router()

userRoutes.get('/', userTest)

export default userRoutes