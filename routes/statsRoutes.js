import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';

const statsRoutes = express.Router();

statsRoutes.post('/dashboard', getDashboardStats);

export default statsRoutes;