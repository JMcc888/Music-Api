const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: "./config/config.env"})

const app = express();
const PORT = process.env.PORT || 3000

const decadesRoutes = require('./routes/decades')

app.use('api/v1/decades', decadesRoutes)

app.listen(PORT, () => {
    console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`)
})