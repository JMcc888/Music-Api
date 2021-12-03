const express = require('express');
const router = express.Router({mergeParams: true});
const advancedResults = require('../middleware/advancedResults')

const Review = require('../models/reviews')

const {protect, authorize} = require('../middleware/auth')

const { 
    getReviews, getReview, createReview, updateReview, deleteReview
} = require('../controllers/reviews')

// /api/v1/reviews
// /api/v1/artist/id/reviews
router.route('/').get(advancedResults(Review, {
    path: 'artist',
    'select': 'artist description youtubeLink'
}),
    getReviews
).post(protect, authorize('user', 'admin'), createReview)

router.route('/:id').get(getReview).put(protect, authorize('admin', 'user'),updateReview).delete(protect, authorize('admin', 'user'), deleteReview)
module.exports = router;