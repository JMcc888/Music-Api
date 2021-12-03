const Review = require('../models/reviews')
const Artist = require('../models/artist')
const ErrorHandler = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');

// GET /api/v1/reviews
// Get /api/v1/decades/:id/reviews

exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.id) {
        const reviews = await Review.find({artist: req.params.id})
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

});


// POST /api/v1/reviews/:id
exports.createReview = asyncHandler(async (req, res, next) => {

    // Add artist and user ids to the request body
    req.body.artist = req.params.id
    req.body.user = req.user.id

    const artist = await Artist.findById(req.params.id)

    if (!artist) {
        return next(new ErrorHandler(`No artist found with id of ${req.params.id}`))
    }

    const review = await Review.create(req.body); // Contains submitted data

    res.status(201).json({
        success: true,
        data: review,
        });
    });

    // GET /api/v1/reviews/:id
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path:'artist',
        select:'artist'
    })
  
    if(!review) {
        return next(new ErrorHandler(`No review found with ID of ${req.params.id}`, 404))
    }

    res.status(201).json({
        success: true,
        data: review,
    });
});

// PUT /api/v1/reviews/:id
exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id); 

    if (!review) {
        return next(new ErrorHandler(`No review found with id of ${req.params.id}`), 404)
    }

    // Verify review belongs to user or user is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler(`Not authorized to update this review ${req.params.id}`, 403))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(201).json({
        success: true,
        data: review,
        });
    });

// DELETE /api/v1/reviews/:id
exports.deleteReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id); 

    if (!review) {
        return next(new ErrorHandler(`No review found with id of ${req.params.id}`), 404)
    }

    // Verify review belongs to user or user is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler(`Not authorized to delete this review ${req.params.id}`, 403))
    }

    await Review.remove({ _id: req.params.id})

    res.status(200).json({
        success: true,
        data: {}
        });
    });