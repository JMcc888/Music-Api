const Artist = require('../models/artist')

exports.getDecades = async (req, res, next) => {
    try {
        const artists = await Artist.find()
        res.status(200).json({
            success: true,
            count: artists.length,
            data: artists
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
    
};

exports.getDecade = async (req, res, next) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({
                success: false
            });
        }
        res.status(200).json({
            success: true,
            data: artist,
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

exports.updateDecade = async (req, res, next) => {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!artist) {
            return res.status(404).json({
                success: false
            });
        }
        res.status(200).json({
            success: true,
            data: artist
        });

    } catch (err) {
        res.status(404).json({
            success: false,
            error: err.message
        });
    }
};
exports.deleteDecade = async (req, res, next) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id)
        if (!artist) {
            return res.status(404).json({
                success: false
            });
        }
        res.status(200).json({
            success: true,
            data: {},
        });

    } catch (err) {
        res.status(404).json({
            success: false,
            error: err.message
        });
    }
};

exports.createDecade = async (req, res, next) => {
    try {
      const newArtist = await Artist.create(req.body)
    res.status(201).json({
        success: true,
        data: newArtist,
    });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
    
};