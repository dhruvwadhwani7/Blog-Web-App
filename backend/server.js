// Express server setup
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

// TODO: Import and use routes
// app.use('/api/auth', require('./routes/authRoutes'))
// app.use('/api/blogs', require('./routes/blogRoutes'))
// app.use('/api/users', require('./routes/userRoutes'))
// app.use('/api/comments', require('./routes/commentRoutes'))
// app.use('/api/admin', require('./routes/adminRoutes'))

// TODO: Error handler middleware
// const errorHandler = require('./middleware/errorHandler')
// app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
