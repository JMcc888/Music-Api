const express = require('express');
const router = express.Router({mergeParams: true});
const advancedResults = require('../middleware/advancedResults')
const Song = require('../models/song')

const {protect, authorize} = require('../middleware/auth')

const { 
    getSongs, getSong, createSong, updateSong, deleteSong
} = require('../controllers/songs')

// /api/v1/songs
// /api/v1/decades/id/songs
router.route('/').get(advancedResults(Song, {
    path: 'artist',
    'select': 'artist youtubeLink'
}), getSongs).post(protect, authorize('publisher', "admin"), createSong)
router.route('/:songId').get(getSong).put(protect, authorize('publisher', "admin"),updateSong).delete(protect, authorize('publisher', "admin"), deleteSong)
module.exports = router;