const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: [true, "Please add a designated decade"],
        unique: [true, "That decade already exists"],
        trim: true,
        maxlength: [15, "Decade name must be 15 characters or less"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add an artist description"],
        maxlength: [150, "Keep the bio short and sweet please"]
    },
    youtubeLink: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please add a valid Youtube URL with HTTP or HTTPS"
        ]
    },
    wikiBio: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please add a valid Wikipedia URL with HTTP or HTTPS"
        ]
    },
    photo: {
        type: String,
        default: "no-photo.png"
    },
    topSong: {
        type: String,
        required: true,
        maxlength: [60, "Song name can be no longer than 60 characters"],
        trim: true
    },
    active: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Artist", ArtistSchema)