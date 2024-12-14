import express from 'express'
import userRoutes from '../routes/userRoutes.js'
import PropertiesRoutes from '../routes/propertiesRoute.js'
import dotenv from 'dotenv'
import connectToDb from '../utils/connectToDb.js'
import AuthRoutes from '../routes/authRoutes.js'
import cors from 'cors'
import UserPropertiesRoutes from '../routes/userProperties.js'
import SuggestionRoutes from '../routes/suggestionRoutes.js'
import articleRoutes from '../routes/articlesRoutes.js'
import statsRoutes from '../routes/statsRoutes.js'
import compression from 'compression'; 

const app = express()
app.use(cors())

dotenv.config()
app.use(express.json())

connectToDb()

app.use(compression());

app.get('/', (req, res) => {
    res.json({
        message: 'Health check'
    })
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/properties', PropertiesRoutes)
app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/userProperties', UserPropertiesRoutes)
app.use('/api/v1/localitySuggestions', SuggestionRoutes)
app.use('/api/v1/articles', articleRoutes)
app.use('/api/v1/stats', statsRoutes)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
app.listen(8080, () => {
    console.log('Server is running on port 8080')
})

export default app
