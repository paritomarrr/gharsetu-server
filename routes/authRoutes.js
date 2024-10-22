import express from 'express'
import { sendOTP, verifyOTP, getUser } from '../controllers/authControllers.js'

const AuthRoutes = express.Router()

AuthRoutes.post('/sendOTP', sendOTP)
AuthRoutes.post('/verifyOTP', verifyOTP)
AuthRoutes.post('/getUser', getUser)

export default AuthRoutes