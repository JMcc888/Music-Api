const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults')
const Artist = require('../models/artist')

const {protect, authorize} = require('../middleware/auth')

const  { getArtist, getArtists, createArtist, updateArtist, deleteArtist, getArtistsInRadius, uploadArtistPhoto} = require('../controllers/artist')


// Include other resource routers
const songRouter = require('./songs');
const reviewRouter = require('./reviews');

// Reroute into other resource routers
router.use('/:id/songs', songRouter)
router.use('/:id/reviews', reviewRouter)


router.route('/').get(advancedResults(Artist, 'songs'), getArtists).post(protect, authorize('publisher', "admin"), createArtist)
router.route('/radius').get(getArtistsInRadius);
router.route('/:id').get(getArtist).put(protect, authorize('publisher', "admin"), updateArtist).delete(protect, authorize('publisher', "admin"), deleteArtist)
router.route('/:id/photo').put(protect, authorize('publisher', "admin"), uploadArtistPhoto)
module.exports = router