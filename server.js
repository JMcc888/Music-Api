// Import NPM/Node Packages
const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser'
)
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')


// Import Local Files
const connectDB = require('./config/connectdb');
const errorHandler = require('./middleware/errorhandler')

// Load dotenv variables
dotenv.config({ path: "./config/config.env"})

// Express config
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

// Allow Cors
app.use(cors())

// Cookie Parser
app.use(cookieParser())

// connect to db
connectDB()

// File Uploading
app.use(fileupload())

// Sanitize input
app.use(mongoSanitize());

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xssClean())

// Rate Limiter
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_MINUTES * 60 * 1000,
    max: process.env.RATE_LIMIT_REQUESTS,
    message: `Too many requests. You are only allowed ${process.env.RATE_LIMIT_REQUESTS} requests per ${process.env.RATE_LIMIT_MINUTES} minutes`
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Set Static folder
app.use(express.static(path.join(__dirname, "public")))

// Import Routes
const artistsRoutes = require('./routes/artist')
const songRoutes = require('./routes/songs')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const reviewRoutes = require('./routes/reviews');


// Use Routes
app.use("/api/v1/artists", artistsRoutes);
app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/reviews", reviewRoutes)

const server = app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`)
});

// Error Handler Usage - LAST ONLY
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    //  Log problem to console
    console.log(`Unhandled Promise Rejection: ${err.message}`)
    // Stop Server and the process
    server.close(() => {
        process.exit(1)
    })
})