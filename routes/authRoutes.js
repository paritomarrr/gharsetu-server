import express from 'express'
import { sendOTP, verifyOTP } from '../controllers/authControllers.js'

const AuthRoutes = express.Router()

AuthRoutes.post('/sendOTP', sendOTP)
AuthRoutes.post('/verifyOTP', verifyOTP)

export default AuthRoutes