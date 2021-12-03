const mongoose = require('mongoose')

const SongSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please give a song title"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a song description"]
    },
    album: {
        // Not required since some songs are single releases
        // Ex: Biggie Smalls One More Chance Remix
        type: String
    },
    billboardPeak: {

    },
    recorded: {
        type: Number,
        required: [true, "Please give a recording date for your song"],
        min: [1900, "No songs prior to 1900 are accepted"],
        max: [1999, "No songs past 1999 are accepted"]
    },
    single: {
        type: Boolean,
        required: true,
        default: false
    },
    decade: {
        type: String,
        required: [true, "Please add a decade period for your song. Format is simply the decade number. IE: 90"],
        enum: [
            '00',
            '10',
            '20',
            '30',
            '40',
            '50',
            '60',
            '70',
            '80',
            '90'
        ]
    },
    youtubeLink: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please add a valid Youtube URL with HTTP or HTTPS"
        ]
    },
    streams: {
        // Amount of times the artist's song was streamed on spotify
        type: Number,
        required: true,
        min: [0, "Streams cannot be less than 0"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    artist: {
        type: mongoose.Schema.ObjectId,
        ref: "Artist",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
})

// ==================
// STATICS
// ==================
// Static for average streams

SongSchema.statics.getAverageStreams = async function(id) {
   // console.log(`Calcing for ur mom with id of ${id}`)


// Aggregated Array Creation
const aggA = await this.aggregate([
    // Array is a pipeline that will execute in order
    {
        $match: {artist: id}
    },
    {
        $group: {
            // Group with id and  average streams
            _id: '$artist',
            averageStreams: {$avg: '$streams'},
        },
    },
]);
// console.log(aggA)

// Update the artist with average stream amount
try {
    await this.model('Artist').findByIdAndUpdate(id, {
        averageStreams: Math.floor(aggA[0].averageStreams)
    })
} catch (err) {
    console.error(err)
}


}

// =============
// Middleware
// =============

// Calc getav after save
SongSchema.post('save', async function() {
   await this.constructor.getAverageStreams(this.artist)
})

// Calc getav after save
SongSchema.pre('remove', async function() {
   await this.constructor.getAverageStreams(this.artist)
})

module.exports = mongoose.model("Song", SongSchema)