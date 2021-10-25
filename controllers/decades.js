const Artist = require('../models/artist')
const ErrorHandler = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler')

exports.getDecades = asyncHandler(async (req, res, next) => {
        const artists = await Artist.find()
        res.status(200).json({
            success: true,
            count: artists.length,
            data: artists
        });
});

exports.getDecade = asyncHandler(async (req, res, next) => {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: artist,
        });
    
});

exports.updateDecade = asyncHandler(async (req, res, next) => {

        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!artist) {
            return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: artist
        });

});
exports.deleteDecade = asyncHandler(async (req, res, next) => {
        const artist = await Artist.findByIdAndDelete(req.params.id)
        if (!artist) {
            return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: {},
        });


});

exports.createDecade = asyncHandler(async (req, res, next) => {
      const newArtist = await Artist.create(req.body)
    res.status(201).json({
        success: true,
        data: newArtist,
    });
    
});