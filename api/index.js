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

const app = express()
app.use(cors())

dotenv.config()
app.use(express.json())

connectToDb()

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

// Mount the article routes
app.use('/api/v1/articles', articleRoutes)
 
app.listen(8080, () => {
    console.log('Server is running on port 8080')
})

export default app
