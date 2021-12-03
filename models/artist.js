const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const ArtistSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: [true, "Please add a designated decade"],
        unique: [true, "That decade already exists"],
        trim: true,
        maxlength: [50, "Decade name must be 50 characters or less"]
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
    firstAlbum: {
        type: String,
        required: true,
        maxlength: [70, "Please enter an album name no longer than 70 characters"],
        trim: true
    },
    location: {
        type: String,
        require: [true, 'please provide a location']
    },
    foundedAt: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number, Number],
        },
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
    active: {
        type: Boolean,
        default: false
    },
    albums: {
        type: Number,
        required: true
    },
    averageStreams: {
        // Average of amount of times songs were streamed
        type: Number
    },
    averageRating: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    id: false

});

// ================
// MIDDLEWARE
// =================
ArtistSchema.pre('save', function (next) {
    this.slug = slugify(this.artist, {
        lower: true,
        replacement: '_'
    });
    next();
});

// Geocode and create location
ArtistSchema.pre('save', async function (next) {
    const e = await geocoder.geocode(this.location);
    const loc = e[0]
    this.foundedAt = {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude],
        city: loc.city,
        state: loc.stateCode,
        zipcode: loc.zipcode,
        country: loc.countryCode
    }
    this.location = undefined;
    next();
});

// ================
// VIRTUALS
// =================
// Reverse populate with virtuals
ArtistSchema.virtual('songs', {
    ref: 'Song',
    "localField": '_id',
   "foreignField": 'artist',
   justOne: false
})

// Cascade Deletion
ArtistSchema.pre('remove', async function (next) {
    console.log(`Songs being deleted from Artist ${this.artist}`)
    await this.model('Song').deleteMany({artist: this._id})
    next()
})

module.exports = mongoose.model("Artist", ArtistSchema);