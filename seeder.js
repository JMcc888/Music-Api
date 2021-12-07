const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')

// Load dotenv
dotenv.config({ path: "./config/config.env"})

// Load models
const Artist = require('./models/artist')
const Song = require('./models/song')
const User = require('./models/user')
const Review = require('./models/reviews')

// Connect to DB
mongoose.connect(process.env.DB_URI, {

});

// Load JSON files
const artists = JSON.parse(fs.readFileSync(`${__dirname}/data/artists.json`, 'utf-8'));
const songs = JSON.parse(fs.readFileSync(`${__dirname}/data/songs.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'));

// Load into DB
const importData = async () => {
    try {
        //await User.create(users)
        await Artist.create(artists)
        await Song.create(songs)
        await Review.create(reviews)
        console.log('working fine')
        process.exit(1)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

// Delete from DB
const deleteData = async () => {
    try {
        await Artist.deleteMany();
        await Song.deleteMany();
        //await User.deleteMany();
        await Review.deleteMany();
        console.log('deletion is fine')
        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(2)
    }
};

// Parse arguments from CLI
if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
} else {
    console.log("You must pass an argument -i or -d")
    process.exit(3);
}