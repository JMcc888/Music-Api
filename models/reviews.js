const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please give a review title"],
        trim: true
    },
    text: {
        type: String,
        required: [true, "Please some text"]
    },
    rating: {
        type: Number,
        required: [true, "Please give this artist a rating"],
        min: 1,
        max: 5
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

// Add index so user can only add one review per artist
ReviewSchema.index({ artist: 1, user: 1 }, { unique: true });


// ==================
// STATICS
// ==================
// Static for average streams

ReviewSchema.statics.getAverageRating = async function(id) {
    console.log(`Calcing for ur mom with id of ${id}`)


// Aggregated Array Creation
const aggA = await this.aggregate([
    // Array is a pipeline that will execute in order
    {
        $match: {artist: id}
    },
    {
        $group: {
            // Group with id and  average ratings
            _id: '$artist',
            averageRating: {$avg: '$rating'},
        },
    },
]);
// console.log(aggA)

// Update the artist with average stream amount
try {
    await this.model('Artist').findByIdAndUpdate(id, {
        averageRating: aggA[0].averageRating
    })
} catch (err) {
    //console.error(err)
}


}

// =============
// Middleware
// =============

// Calc getav after save
ReviewSchema.post('save', async function() {
   await this.constructor.getAverageRating(this.artist)
})

// Calc getav after save
ReviewSchema.pre('remove', async function() {
   await this.constructor.getAverageRating(this.artist)
})


module.exports = mongoose.model("Review", ReviewSchema)