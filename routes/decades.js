const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults')
const Artist = require('../models/artist')

const  { getDecade, getDecades, createDecade, updateDecade, deleteDecade, getArtistsInRadius, uploadArtistPhoto} = require('../controllers/decades')


// Include other resource routers
const songRouter = require('./songs');

// Reroute into other resource routers
router.use('/:id/songs', songRouter)



router.route('/').get(advancedResults(Artist, 'songs'), getDecades).post(createDecade)
router.route('/radius').get(getArtistsInRadius);
router.route('/:id').get(getDecade).put(updateDecade).delete(deleteDecade)
router.route('/:id/photo').put(uploadArtistPhoto)
module.exports = router