const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults')
const Artist = require('../models/artist')

const  { getArtist, getArtists, createArtist, updateArtist, deleteArtist, getArtistsInRadius, uploadArtistPhoto} = require('../controllers/artist')


// Include other resource routers
const songRouter = require('./songs');

// Reroute into other resource routers
router.use('/:id/songs', songRouter)



router.route('/').get(advancedResults(Artist, 'songs'), getArtists).post(createArtist)
router.route('/radius').get(getArtistsInRadius);
router.route('/:id').get(getArtist).put(updateArtist).delete(deleteArtist)
router.route('/:id/photo').put(uploadArtistPhoto)
module.exports = router