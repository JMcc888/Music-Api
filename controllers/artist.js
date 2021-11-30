const Artist = require('../models/artist')
const ErrorHandler = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler')
const geocoder = require('../utils/geocoder')
const path = require('path')

exports.getArtists = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

    // // Send
    //     res.status(200).json({
    //         success: true,
    //         count: artists.length,
    //         pagination,
    //         data: artists
    //     });
});

exports.getArtist = asyncHandler(async (req, res, next) => {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: artist,
        });
    
});

exports.updateArtist = asyncHandler(async (req, res, next) => {

    let artist = await Artist.findById(req.params.id)

        if (!artist) {
            return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
        }

        // Ensure User is univeristy owner
        if(artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler(`User ${req.user.id} not authorized to update this resource`, 403));
        }

        artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: artist
        });

});
exports.deleteArtist = asyncHandler(async (req, res, next) => {
        const artist = await Artist.findById(req.params.id)
        if (!artist) {
            return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
        }

                // Ensure User is univeristy owner
                if(artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
                    return next(new ErrorHandler(`User ${req.user.id} not authorized to delete this resource`, 403));
                }

        artist.remove()

        res.status(200).json({
            success: true,
            data: {},
        });


});

exports.createArtist = asyncHandler(async (req, res, next) => {

    // Check if user has already created artist
    const publishedArtist = await Artist.findOne({user: req.user.id})
    if (publishedArtist && req.user.role !== 'admin') {
        return next(new ErrorHandler('This user has already created an artist'), 400)
    }



    req.body.user = req.user.id
      const newArtist = await Artist.create(req.body)
    res.status(201).json({
        success: true,
        data: newArtist,
    });
    
});

exports.getArtistsInRadius = asyncHandler(async (req, res, next) => {
    // Get data from req.query
    const zipcode = req.query.zipcode
    const distanceInMiles = req.query.distanceInMiles
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    console.log(lat, lng)
    res.send('test')

    // Calculate radius using radians
        // Divide the given distance by the radius of earth
    const earthRadiusInMiles = 3959
    const radius = distanceInMiles / earthRadiusInMiles;

    // Query DB and return response
    const artists = await Artist.find({
        foundedAt: {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }}
    })


    res.status(200).json({
        success: true,
        count: artists.length,
        data: artists
    })
});

exports.uploadArtistPhoto = asyncHandler(async (req, res, next) => {
    // Find artist
    const artist = await Artist.findById(req.params.id)

    if (!artist) {
        return next(new ErrorHandler(`Artist not found with ID of ${req.params.id}`, 404));
    }

        // Ensure User is univeristy owner
        if(artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler(`User ${req.user.id} not authorized to update this resource`, 403));
        }

    // Validate Image

    // Actually seems to work but postman wraps my images into a folder

    //console.log(req.files)
    if (!req.files) {
        return next(new ErrorHandler(`Please upload a file`, 400));
    }

    // Error checking definitely works
    // Won't let me upload a photo
    const file = req.files.file

    // Make sure is imga
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorHandler(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.FILE_UPLOAD_MAX_SIZE) {
       return next(new ErrorHandler(`Please upload an image file smaller than ${process.end.FILE_UPLOAD_MAX_SIZE}`, 400))
    }


    // Change File name: photo_artistid
    file.name =`photo_${artist._id}${path.parse(file.name).ext}`;

    // Move image to proper location
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
        if(err) { 
        return next(new ErrorHandler(`Problem uploading file`, 500))
    }
    })

    // Update Artist with new image file
    await Artist.findByIdAndUpdate(req.params.id, { photo: file.name})
    // Send response
    res.status(200).json({
        success: true,
        data: {
            artist: artist._id,
            file: file.name
        }
    })
});