// Import NPM/Node Packages
const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload')
// Import Local Files
const connectDB = require('./config/connectdb');
const errorHandler = require('./middleware/errorhandler')

// Load dotenv variables
dotenv.config({ path: "./config/config.env"})

// Express config
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

// connect to db
connectDB()

// File Uploading
app.use(fileupload())

// Set Static folder
app.use(express.static(path.join(__dirname, "public")))

// Import Routes
const decadesRoutes = require('./routes/decades')
const songRoutes = require('./routes/songs')

app.use("/api/v1/decades", decadesRoutes);
app.use("/api/v1/songs", songRoutes);

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