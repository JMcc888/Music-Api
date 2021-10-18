const mongoose = require('mongoose')

const connectDB = async () => {
   const con = await mongoose.connect(process.env.DB_URI, {

   })
}

module.exports = connectDB