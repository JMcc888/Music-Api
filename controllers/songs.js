const Song = require('../models/song')
const Artist = require('../models/artist')
const ErrorHandler = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');

// GET /api/v1/songs
// Get /api/v1/decades/:id/songs

exports.getSongs = asyncHandler(async (req, res, next) => {

    // Initialize Query
    // let query;

    // Check if ID was passed
    if (req.params.id) {
        const songs = await Song.find({artist: req.params.id})
        return res.status(200).json({
            success: true,
            count: songs.length,
            data: songs
        })
    } else {
        res.status(200).json(res.advancedResults)
        // query = Song.find().populate({
        //     path: 'artist',
        //     'select': 'artist youtubeLink'
        // })
    }

    // const songs = await query;
    // res.status(200).json({
    //     success: true,
    //     count: songs.length,
    //     data: songs
    // })
});

exports.getSong = asyncHandler(async (req, res, next) => {

    const song = await Song.findById(req.params.songId).populate({
        path: 'artist',
        select: 'artist'
    })

    if(!song) {
        return next(new ErrorHandler(`No song with ID of ${req.params.id}`, 404))
    }
    
    res.status(200).json({
        success: true,
        data: song
    })
});

// POST /api/v1/decades/:id/songs
exports.createSong = asyncHandler(async (req, res, next) => {
    // Update Request Body to add Artist ID
    req.body.artist = req.params.id
    req.body.user = req.user.id

    // Get the artist
    const artist = await Artist.findById(req.params.id)

    // Make sure artist exists
    if(!artist) {
        return next(new ErrorHandler(`No song with ID of ${req.params.id}`, 404))
    }

        // Ensure User is univeristy owner
        if(artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler(`User ${req.user.id} not authorized to add a song to artist ${artist._id}`, 403));
        }
    
    // Create song, assigning to artist
    const song = await Song.create(req.body)
    // Includes id of artist and user id

    // Response
    res.status(201).json({
        success: true,
        data: song
    })
});

// PUT /api/v1/songs/:songid
exports.updateSong = asyncHandler(async (req, res, next) => {
    let song = await Song.findById(req.params.songId)

    if (!song) {
        return next(new ErrorHandler(`No song with ID of ${req.params.id}`, 404))
    }

            // Ensure User is song owner
            if(song.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return next(new ErrorHandler(`User ${req.user.id} not authorized to update this song ${song._id}`, 403));
            }

    song = await Song.findByIdAndUpdate(req.params.songId, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: song,
    })
});

// DELETE /api/v1/songs/:songid
exports.deleteSong = asyncHandler(async (req, res, next) => {
    const song = await Song.findById(req.params.songId)

    if (!song) {
        return next(new ErrorHandler(`No song with ID of ${req.params.id}`, 404))
    }

                // Ensure User is song owner
                if(song.user.toString() !== req.user.id && req.user.role !== 'admin') {
                    return next(new ErrorHandler(`User ${req.user.id} not authorized to delete this song ${song._id}`, 403));
                }

    await song.remove()

    res.status(200).json({
        success: true,
        data: {},
    })
});